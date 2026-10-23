import { useQueryClient } from "@tanstack/react-query";
import {
  getBlogGetPostQueryKey,
  useBlogCreatePost,
  useBlogDeletePost,
  useBlogGetPost,
  useBlogUpdatePost,
  type BlogPostDto,
} from "@wangoh/api-client";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { getErrorStatus } from "@/api/errors";
import { spacing } from "@/theme";
import { Badge, Button, Card, EmptyState, ErrorState, Header, Input, LoadingView, RemoteImage, Screen, Text } from "@/ui";

import { BlockRenderer } from "../../blog/components/BlockRenderer";
import { FIELD_LIMITS, isHttpsUrl } from "../../blog/contentRules";
import { formatDateTr } from "../../blog/format";
import { parseBlocks } from "../blocks";
import { AdminGuard } from "../components/AdminGuard";
import { Banner } from "../components/Banner";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { TextArea } from "../components/TextArea";
import { invalidatePosts } from "../invalidate";
import { adminHref } from "../navigation";
import {
  NO_ERRORS,
  buildCreateDto,
  buildUpdateDto,
  emptyForm,
  formFromPost,
  hasErrors,
  mapServerErrors,
  suggestSlug,
  validatePostForm,
  type PostFormErrors,
  type PostFormValues,
} from "../postForm";

function leave() {
  if (router.canGoBack()) router.back();
  else router.dismissTo(adminHref("posts"));
}

type SubmitKind = "save" | "draft" | "publish" | "unpublish";

const BODY_HELP = [
  "Paragraflar boş satırla ayrılır.",
  "## Başlık  ·  ### Alt başlık",
  "- madde işaretli liste  ·  1. numaralı liste",
  "> alıntı (son satır “> — Kaynak” olabilir)",
  "![açıklama](https://adres) görsel (yalnız https)",
  "Bir satırı düz metin yapmak için başına \\ koy.",
].join("\n");

/** Yeni yazı ekranı (`/admin/new-post`). */
export function NewPostScreen() {
  return <EditorFrame />;
}

/** Yazı düzenleme ekranı (`/admin/post/<slug>`). */
export function PostEditScreen() {
  const params = useLocalSearchParams<{ slug?: string | string[] }>();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) ?? "";
  return <EditorFrame slug={slug} />;
}

function EditorFrame({ slug }: { slug?: string }) {
  const [dirty, setDirty] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const back = () => (dirty ? setConfirmLeave(true) : leave());

  return (
    <Screen header={<Header title={slug === undefined ? "Yeni yazı" : "Yazıyı düzenle"} back={back} />} keyboardAvoiding>
      <AdminGuard>{slug === undefined ? <PostForm onDirtyChange={setDirty} /> : <EditLoader slug={slug} onDirtyChange={setDirty} />}</AdminGuard>
      <ConfirmDialog
        visible={confirmLeave}
        title="Değişiklikler kaydedilmedi"
        message="Bu ekrandan çıkarsan yaptığın değişiklikler kaybolur."
        confirmLabel="Çık, kaydetme"
        cancelLabel="Düzenlemeye dön"
        destructive
        onConfirm={() => {
          setConfirmLeave(false);
          leave();
        }}
        onCancel={() => setConfirmLeave(false)}
      />
    </Screen>
  );
}

function EditLoader({ slug, onDirtyChange }: { slug: string; onDirtyChange: (dirty: boolean) => void }) {
  const post = useBlogGetPost(slug, { lang: "tr" }, { query: { enabled: slug !== "", staleTime: 0 } });

  if (slug === "" || (post.isError && getErrorStatus(post.error) === 404)) {
    return (
      <EmptyState
        icon="document-text-outline"
        title="Yazı bulunamadı"
        message="Yazı silinmiş ya da adresi değişmiş olabilir."
        actionLabel="Yazılara dön"
        onAction={() => router.dismissTo(adminHref("posts"))}
      />
    );
  }
  if (post.isPending) return <LoadingView message="Yazı yükleniyor…" />;
  if (post.isError) return <ErrorState error={post.error} title="Yazı yüklenemedi" onRetry={() => void post.refetch()} retrying={post.isFetching} />;
  // `key`: başka bir yazıya geçilirse form baştan kurulur.
  return <PostForm key={post.data.id} original={post.data} onDirtyChange={onDirtyChange} />;
}

interface PostFormProps {
  original?: BlogPostDto;
  onDirtyChange: (dirty: boolean) => void;
}

function sameValues(a: PostFormValues, b: PostFormValues): boolean {
  return (
    a.slug.trim() === b.slug.trim() &&
    a.title.trim() === b.title.trim() &&
    a.excerpt.trim() === b.excerpt.trim() &&
    a.tags.trim() === b.tags.trim() &&
    a.coverImage.trim() === b.coverImage.trim() &&
    a.countryCode.trim() === b.countryCode.trim() &&
    a.body.replace(/\r\n?/g, "\n") === b.body.replace(/\r\n?/g, "\n")
  );
}

function PostForm({ original, onDirtyChange }: PostFormProps) {
  const queryClient = useQueryClient();
  const create = useBlogCreatePost();
  const update = useBlogUpdatePost();
  const remove = useBlogDeletePost();
  const editing = original !== undefined;

  const baseline = useMemo(() => (original ? formFromPost(original) : emptyForm()), [original]);
  const [values, setValues] = useState<PostFormValues>(baseline);
  const [slugTouched, setSlugTouched] = useState(editing);
  const [attempt, setAttempt] = useState<{ publish: boolean } | null>(null);
  const [serverErrors, setServerErrors] = useState<PostFormErrors | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const dirty = !sameValues(values, baseline);
  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  const busy = create.isPending || update.isPending || remove.isPending;
  const clientErrors = useMemo(() => (attempt ? validatePostForm(values, attempt) : NO_ERRORS), [attempt, values]);
  const errors = serverErrors ?? clientErrors;

  function change(patch: Partial<PostFormValues>) {
    setServerErrors(null);
    setNotice(null);
    setValues((current) => {
      const next = { ...current, ...patch };
      // Yeni yazıda slug, elle değiştirilene kadar başlıktan önerilir.
      if (!editing && !slugTouched && patch.title !== undefined) next.slug = suggestSlug(patch.title);
      return next;
    });
  }

  async function submit(kind: SubmitKind) {
    const willBePublished = kind === "publish" || (kind === "save" && original?.status === "published");
    setNotice(null);
    setAttempt({ publish: willBePublished });
    setServerErrors(null);
    if (hasErrors(validatePostForm(values, { publish: willBePublished }))) return;

    const bodyLines = parseBlocks(values.body.replace(/\r\n?/g, "\n")).lines;
    try {
      if (!original) {
        const created = await create.mutateAsync({ data: buildCreateDto(values, kind === "publish" ? "published" : "draft") });
        await invalidatePosts(queryClient, [created.slug]);
        router.dismissTo(adminHref("posts"));
        return;
      }
      const status = kind === "publish" ? "published" : kind === "unpublish" ? "draft" : undefined;
      const dto = buildUpdateDto(values, original, { status });
      if (!dto) {
        setNotice("Değişiklik yok.");
        return;
      }
      const updated = await update.mutateAsync({ id: original.id, data: dto });
      // Önbelleği yanıtla güncelle (ekran bayat veriyle bir an bile görünmesin); slug değiştiyse yeni adrese geç.
      queryClient.setQueryData(getBlogGetPostQueryKey(updated.slug, { lang: "tr" }), updated);
      if (updated.slug !== original.slug) router.setParams({ slug: updated.slug });
      await invalidatePosts(queryClient, [updated.slug], updated.slug !== original.slug ? [original.slug] : []);
      setAttempt(null);
      setValues(formFromPost(updated));
      setNotice(kind === "publish" ? "Yazı yayınlandı." : kind === "unpublish" ? "Yazı taslağa alındı." : "Değişiklikler kaydedildi.");
    } catch (caught) {
      setServerErrors(mapServerErrors(caught, { bodyLines }));
    }
  }

  async function confirmRemove() {
    if (!original) return;
    try {
      await remove.mutateAsync({ id: original.id });
      queryClient.removeQueries({ queryKey: getBlogGetPostQueryKey(original.slug) });
      await invalidatePosts(queryClient, []);
      setConfirmDelete(false);
      onDirtyChange(false);
      router.dismissTo(adminHref("posts"));
    } catch (caught) {
      setConfirmDelete(false);
      setServerErrors(mapServerErrors(caught));
    }
  }

  const coverPreview = values.coverImage.trim();
  const otherLangs = original?.availableLangs.filter((lang) => lang !== "tr") ?? [];
  const errorCount = Object.keys(errors.fields).length + errors.body.length;
  const previewBlocks = useMemo(() => (showPreview ? parseBlocks(values.body.replace(/\r\n?/g, "\n")).blocks : []), [showPreview, values.body]);

  return (
    <View style={styles.column}>
      {original ? (
        <View style={styles.statusRow}>
          <Badge label={original.status === "published" ? "Yayında" : "Taslak"} tone={original.status === "published" ? "success" : "gold"} />
          {original.publishedAt ? (
            <Text variant="caption" color="textMuted">
              İlk yayın: {formatDateTr(original.publishedAt)}
            </Text>
          ) : null}
        </View>
      ) : null}

      {otherLangs.length > 0 ? (
        <Banner
          tone="info"
          message={`Bu ekran yalnız Türkçe metni düzenler. ${otherLangs.map((lang) => (lang === "en" ? "İngilizce" : "İspanyolca")).join(" ve ")} çeviri olduğu gibi korunur.`}
          testID="post-lang-note"
        />
      ) : null}

      <Input
        label="Başlık"
        value={values.title}
        onChangeText={(title) => change({ title })}
        error={errors.fields.title}
        maxLength={FIELD_LIMITS.title + 50}
        autoCapitalize="sentences"
        returnKeyType="next"
        testID="post-title"
      />

      <View>
        <Input
          label="Adres (slug)"
          value={values.slug}
          onChangeText={(slug) => {
            setSlugTouched(true);
            change({ slug });
          }}
          error={errors.fields.slug}
          hint={
            editing
              ? "Adres değişirse eski bağlantılar çalışmaz. Küçük harf, rakam ve tire."
              : "Başlıktan otomatik önerilir; istersen değiştir. Küçük harf, rakam ve tire."
          }
          autoCapitalize="none"
          autoCorrect={false}
          testID="post-slug"
        />
        <Button
          title="Başlıktan öner"
          variant="ghost"
          size="sm"
          onPress={() => {
            setSlugTouched(false);
            change({ slug: suggestSlug(values.title) });
          }}
          style={styles.suggest}
        />
      </View>

      <TextArea
        label="Özet"
        value={values.excerpt}
        onChangeText={(excerpt) => change({ excerpt })}
        error={errors.fields.excerpt}
        hint="Liste kartında görünen kısa özet."
        maxChars={FIELD_LIMITS.excerpt}
        minHeight={110}
        testID="post-excerpt"
      />

      <Input
        label="Etiketler"
        value={values.tags}
        onChangeText={(tags) => change({ tags })}
        error={errors.fields.tags}
        hint="Virgülle ayır (en fazla 20). Harf, rakam ve tire kullan; büyük harf küçültülür."
        autoCapitalize="none"
        autoCorrect={false}
        testID="post-tags"
      />

      <Input
        label="Kapak görseli adresi (isteğe bağlı)"
        value={values.coverImage}
        onChangeText={(coverImage) => change({ coverImage })}
        error={errors.fields.coverImage}
        hint="Yalnız https:// ile başlayan adres."
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        testID="post-cover"
      />
      {coverPreview !== "" && isHttpsUrl(coverPreview) ? <RemoteImage uri={coverPreview} alt="Kapak görseli önizlemesi" aspectRatio={16 / 9} radius={12} /> : null}

      <Input
        label="Ülke kodu (isteğe bağlı)"
        value={values.countryCode}
        onChangeText={(countryCode) => change({ countryCode: countryCode.toUpperCase() })}
        error={errors.fields.countryCode}
        hint="İki harfli ülke kodu (ör. JP). Yazıdan ülke rehberine bağlantı verir."
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={2}
        testID="post-country"
      />

      <View style={styles.bodyHeader}>
        <Button title={showHelp ? "Biçim ipuçlarını gizle" : "Biçim ipuçları"} variant="ghost" size="sm" onPress={() => setShowHelp((v) => !v)} />
        <Button title={showPreview ? "Önizlemeyi gizle" : "Önizle"} variant="ghost" size="sm" onPress={() => setShowPreview((v) => !v)} />
      </View>
      {showHelp ? (
        <Card>
          <Text variant="small" color="textSecondary" selectable>
            {BODY_HELP}
          </Text>
        </Card>
      ) : null}
      <TextArea
        label="Gövde"
        value={values.body}
        onChangeText={(body) => change({ body })}
        error={errors.body.length > 0 ? errors.body.join("\n") : null}
        hint={errors.body.length > 0 ? undefined : "Düz metin; paragraflar boş satırla ayrılır. Biçim için “Biçim ipuçları”na bak."}
        minHeight={260}
        autoCapitalize="sentences"
        testID="post-body"
      />
      {showPreview ? (
        <Card>
          {previewBlocks.length > 0 ? <BlockRenderer blocks={previewBlocks} /> : <Text variant="small" color="textMuted">Önizlenecek içerik yok.</Text>}
        </Card>
      ) : null}

      {errorCount > 0 ? <Banner message={`Formda ${errorCount} sorun var. Kırmızı alanları düzeltip tekrar dene.`} testID="post-error-summary" /> : null}
      {errors.form ? <Banner message={errors.form} testID="post-error" /> : null}
      {notice ? <Banner tone="success" message={notice} testID="post-notice" /> : null}

      <View style={styles.actions}>
        {editing ? (
          <>
            <Button title="Kaydet" onPress={() => void submit("save")} loading={update.isPending} disabled={busy || !dirty} fullWidth testID="post-save" />
            {original.status === "draft" ? (
              <Button title={dirty ? "Kaydet ve yayınla" : "Yayınla"} variant="secondary" onPress={() => void submit("publish")} disabled={busy} fullWidth testID="post-publish" />
            ) : (
              <Button title={dirty ? "Kaydet ve taslağa al" : "Taslağa al"} variant="secondary" onPress={() => void submit("unpublish")} disabled={busy} fullWidth testID="post-unpublish" />
            )}
            <Button title="Yazıyı sil" variant="danger" onPress={() => setConfirmDelete(true)} disabled={busy} fullWidth testID="post-delete" />
          </>
        ) : (
          <>
            <Button title="Taslak olarak kaydet" onPress={() => void submit("draft")} loading={create.isPending} disabled={busy} fullWidth testID="post-save-draft" />
            <Button title="Kaydet ve yayınla" variant="secondary" onPress={() => void submit("publish")} disabled={busy} fullWidth testID="post-publish" />
          </>
        )}
      </View>

      <ConfirmDialog
        visible={confirmDelete}
        title="Yazı silinsin mi?"
        message={`“${original?.title ?? ""}” kalıcı olarak silinecek; İngilizce ve İspanyolca çevirileri de gider. Bu işlem geri alınamaz.`}
        confirmLabel="Kalıcı olarak sil"
        destructive
        loading={remove.isPending}
        onConfirm={() => void confirmRemove()}
        onCancel={() => setConfirmDelete(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  column: { width: "100%", maxWidth: 720, alignSelf: "center", gap: spacing.lg, paddingBottom: spacing.xxxl },
  statusRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  suggest: { alignSelf: "flex-start", marginTop: spacing.xs },
  bodyHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  actions: { gap: spacing.md },
});
