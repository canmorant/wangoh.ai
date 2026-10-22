import { Injectable } from "@nestjs/common";
import { cryptoRng } from "./rng.js";

/**
 * Oyun saati. Tur süresi, zaman aşımı ve oturum ömrü hep buradan ölçülür (istemci saati hiç kullanılmaz).
 * Ayrı bir sınıf olması testlerin süreyi belirleyici biçimde ilerletmesi içindir.
 */
@Injectable()
export class GameClock {
  now(): Date {
    return new Date();
  }
}

/** Oyun rastgeleliği: `crypto` tabanlı. Testler `next` yöntemini tohumlu bir üreteçle değiştirir. */
@Injectable()
export class GameRandom {
  next(): number {
    return cryptoRng();
  }
}
