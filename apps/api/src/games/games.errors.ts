import { AppException, ErrorCode } from "../common/errors.js";
import { GameErrorCode } from "./games.constants.js";

/*
 * Oyun hataları. Mesajlar Türkçe ve kullanıcıya gösterilebilir; hiçbiri doğru cevabı ya da başka
 * kullanıcının oturumuna dair bilgiyi (varlığı dahil) ele vermez.
 */

/** Oturum yok YA DA başkasına ait: ikisi de 404 (başkasının oturum kimliğinin varlığı sızmaz). */
export const sessionNotFound = (): AppException => AppException.notFound("Oyun oturumu bulunamadı.");

export const sessionExpired = (): AppException =>
  new AppException(410, GameErrorCode.SESSION_EXPIRED, "Oyun oturumunun süresi doldu. Yeni bir oyun başlatın.");

export const sessionNotActive = (): AppException =>
  AppException.conflict("Bu oyun oturumu artık etkin değil.", GameErrorCode.SESSION_NOT_ACTIVE);

export const roundAlreadyAnswered = (): AppException =>
  AppException.conflict("Bu tur zaten cevaplandı. Oturumun güncel durumunu alın.", GameErrorCode.ROUND_ALREADY_ANSWERED);

export const roundOutOfOrder = (): AppException =>
  AppException.conflict("Turlar sırayla cevaplanmalı. Oturumun güncel durumunu alın.", GameErrorCode.ROUND_OUT_OF_ORDER);

export const noRoundLeft = (): AppException =>
  AppException.conflict("Tüm turlar cevaplandı. Oyunu bitirin.", GameErrorCode.NO_ROUND_LEFT);

export const notFinished = (): AppException =>
  AppException.conflict("Oyunu bitirmek için önce tüm turları cevaplamalısınız.", GameErrorCode.NOT_FINISHED);

export const scoreRemoved = (): AppException =>
  new AppException(410, GameErrorCode.SCORE_REMOVED, "Bu oyunun puanı kaldırıldı.");

/** Oturum açık görünüyordu ama hesap bu arada silindi. */
export const accountGone = (): AppException =>
  AppException.unauthorized(ErrorCode.AUTH_TOKEN_INVALID, "Oturumunuz geçersiz ya da süresi dolmuş. Lütfen yeniden giriş yapın.");
