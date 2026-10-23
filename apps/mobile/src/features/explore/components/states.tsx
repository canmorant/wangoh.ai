import { getErrorStatus } from "@/api/errors";
import { EmptyState, type EmptyStateProps } from "@/ui";

/** Kayıt yok (404) ya da adres parçası bozuk (400): yeniden denemek sonucu değiştirmez. */
export function isNotFoundError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status === 404 || status === 400;
}

/** "Bulunamadı" ekranı: yeniden dene yerine geri dönüş eylemi sunar. */
export function NotFoundState(props: Pick<EmptyStateProps, "title" | "message" | "actionLabel" | "onAction">) {
  return <EmptyState icon="map-outline" {...props} />;
}
