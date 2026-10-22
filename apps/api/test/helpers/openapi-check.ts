/*
 * Gerçek yanıtı OpenAPI şemasına karşı denetleyen küçük doğrulayıcı (yalnız Nest DTO'larının ürettiği alt küme:
 * $ref, allOf/oneOf/anyOf, type, nullable, enum, format uuid/date-time, minimum/maximum, properties/required).
 * Ajv gibi bir bağımlılık eklenmez. Şemada TANIMSIZ bir anahtar gelirse de sorun sayılır: belgelenmemiş alan
 * (ör. yanlışlıkla sızan iç alan) sözleşme dışıdır.
 */

type Schema = Record<string, unknown>;

export interface OpenApiLike {
  components?: { schemas?: Record<string, unknown> };
  paths: Record<string, unknown>;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

const typeOf = (value: unknown): string => (value === null ? "null" : Array.isArray(value) ? "array" : typeof value);

/** `value`, `schema`'ya uymuyorsa sorunları döner (boş dizi = uyumlu). */
export function checkAgainstSchema(doc: OpenApiLike, schema: unknown, value: unknown, path = "$"): string[] {
  const s = schema as Schema;
  if (s.$ref !== undefined) {
    const name = String(s.$ref).replace("#/components/schemas/", "");
    const target = doc.components?.schemas?.[name];
    if (!target) return [`${path}: çözülemeyen $ref ${String(s.$ref)}`];
    return checkAgainstSchema(doc, target, value, path);
  }
  // OpenAPI 3.0: `nullable` kardeş `allOf`/`oneOf` için de null kabul eder (Nest bu biçimi üretir).
  if (value === null) return s.nullable === true ? [] : [`${path}: null gelmez (nullable değil)`];

  const problems: string[] = [];
  for (const key of ["allOf", "oneOf", "anyOf"] as const) {
    const parts = s[key] as unknown[] | undefined;
    if (!parts) continue;
    const results = parts.map((p) => checkAgainstSchema(doc, p, value, path));
    if (key === "allOf") problems.push(...results.flat());
    else if (key === "oneOf" && results.filter((r) => r.length === 0).length !== 1) problems.push(`${path}: oneOf için tam bir şema eşleşmeli (${results.map((r) => r.length === 0).join(",")})`);
    else if (key === "anyOf" && !results.some((r) => r.length === 0)) problems.push(`${path}: anyOf hiçbirine uymuyor`);
  }

  const type = s.type as string | undefined;
  const actual = typeOf(value);
  if (type) {
    const ok = type === "integer" ? Number.isInteger(value) : type === "number" ? actual === "number" && Number.isFinite(value as number) : type === actual;
    if (!ok) return [...problems, `${path}: ${type} beklenirdi, ${actual} geldi`];
  }
  if (Array.isArray(s.enum) && !s.enum.includes(value)) problems.push(`${path}: ${JSON.stringify(value)} enum dışı (${JSON.stringify(s.enum)})`);
  if (typeof value === "string") {
    if (s.format === "uuid" && !UUID.test(value)) problems.push(`${path}: uuid değil (${value})`);
    if (s.format === "date-time" && (!DATE_TIME.test(value) || Number.isNaN(Date.parse(value)))) problems.push(`${path}: date-time değil (${value})`);
  }
  if (typeof value === "number") {
    if (typeof s.minimum === "number" && value < s.minimum) problems.push(`${path}: ${value} < minimum ${s.minimum}`);
    if (typeof s.maximum === "number" && value > s.maximum) problems.push(`${path}: ${value} > maximum ${s.maximum}`);
  }
  if (Array.isArray(value) && s.items !== undefined) value.forEach((item, i) => problems.push(...checkAgainstSchema(doc, s.items, item, `${path}[${i}]`)));
  if (actual === "object" && (s.properties !== undefined || type === "object")) {
    const props = (s.properties ?? {}) as Record<string, unknown>;
    const obj = value as Record<string, unknown>;
    for (const key of (s.required ?? []) as string[]) if (!(key in obj)) problems.push(`${path}.${key}: zorunlu alan yok`);
    for (const [key, v] of Object.entries(obj)) {
      if (!(key in props)) {
        // Birleştirilmiş şemalarda (allOf) alan başka parçada tanımlı olabilir: yalnız tek parçalı nesnede sıkı denetle.
        if (s.allOf === undefined && s.oneOf === undefined && s.anyOf === undefined) problems.push(`${path}.${key}: şemada tanımsız alan`);
        continue;
      }
      problems.push(...checkAgainstSchema(doc, props[key], v, `${path}.${key}`));
    }
  }
  return problems;
}

/** Bir operasyonun belgelenmiş yanıtına göre gerçek yanıtı denetler; belgesiz durum kodu da sorundur. */
export function checkResponse(doc: OpenApiLike, method: string, pathTemplate: string, res: { status: number; body: unknown; text?: string }): string[] {
  const op = (doc.paths[pathTemplate] as Record<string, { operationId: string; responses: Record<string, { content?: Record<string, { schema?: unknown }> }> }> | undefined)?.[method];
  if (!op) return [`${method} ${pathTemplate}: belgede yok`];
  const response = op.responses[String(res.status)];
  if (!response) return [`${op.operationId}: ${res.status} yanıtı belgede yok (belgelenen: ${Object.keys(op.responses).join(", ")})`];
  const schema = response.content?.["application/json"]?.schema;
  if (!schema) return res.status === 204 && res.text ? [`${op.operationId}: 204 yanıtı gövde taşıyor`] : [];
  return checkAgainstSchema(doc, schema, res.body).map((p) => `${op.operationId} ${res.status} ${p}`);
}
