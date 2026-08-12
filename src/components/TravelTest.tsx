"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { countries } from "@/data/destinations";
import { EASE_OUT, EASE_SOFT } from "@/lib/motion";

interface Option {
  label: string;
  note: string;
  weights: Partial<Record<string, number>>;
}

interface Question {
  prompt: string;
  kicker: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    kicker: "İlk sabah",
    prompt: "Yeni bir yerde uyandın. Seni yataktan ne kaldırır?",
    options: [
      { label: "Şehir uyanmadan önceki sessizlik", note: "Boş sokaklar, soğuk hava", weights: { JP: 3, KR: 1 } },
      { label: "Çoktan uğuldayan bir pazar", note: "Buhar, bağırışlar, kahvaltı", weights: { TH: 3, KR: 1 } },
      { label: "Ayakta, tezgâhta bir kahve", note: "Doksan saniye, sonra dışarı", weights: { IT: 3, FR: 1 } },
      { label: "Silüet eşliğinde bir koşu", note: "Uçsuz bucaksız bir yerde", weights: { US: 3 } },
    ],
  },
  {
    kicker: "Doku",
    prompt: "Elinin altında hissetmek istediğin yüzeyi seç.",
    options: [
      { label: "Güneşten ısınmış, yıpranmış taş", note: "Yüzyılların izi", weights: { IT: 3, FR: 1 } },
      { label: "İşlenmemiş sedir ağacı", note: "Yumuşak, soluk, özenli", weights: { JP: 3 } },
      { label: "Fırçalanmış çelik ve cam", note: "Soğuk, keskin", weights: { US: 2, KR: 2 } },
      { label: "Islak tik ağacı ve tuz", note: "Suya yakın bir yerde", weights: { TH: 3 } },
    ],
  },
  {
    kicker: "Akşam yemeği",
    prompt: "Yolculuğun en iyi yemeği nerede olur?",
    options: [
      { label: "Sekiz kişilik bir tezgâh", note: "Menü yok, seçenek yok", weights: { JP: 3, KR: 1 } },
      { label: "Kaldırımda plastik bir tabure", note: "Hayatında yediğin en iyi şey", weights: { TH: 3 } },
      { label: "Sürekli uzayan uzun bir masa", note: "Kimse kalkmıyor", weights: { IT: 3 } },
      { label: "Aylar önce rezervasyon yaptığın bir yer", note: "Her kuruşuna değer", weights: { FR: 3, US: 1 } },
    ],
  },
  {
    kicker: "Işık",
    prompt: "Hangi ışık için şehri baştan sona geçersin?",
    options: [
      { label: "Islak asfaltta neon", note: "Gece yarısından sonra", weights: { JP: 2, KR: 3 } },
      { label: "Kireçtaşı üzerinde altın rengi", note: "Alacakaranlıktan önceki son saat", weights: { FR: 3, IT: 2 } },
      { label: "Suyun üzerinde sert öğle güneşi", note: "Bakamayacak kadar parlak", weights: { TH: 3 } },
      { label: "Gökdelenler arasında gün doğumu", note: "Bütün şehir ışıldıyor", weights: { US: 3 } },
    ],
  },
  {
    kicker: "Bir gün daha",
    prompt: "Beklemediğin fazladan bir gün kazandın.",
    options: [
      { label: "Plansız bir trene bin", note: "Doğru göründüğü yerde in", weights: { JP: 2, FR: 2 } },
      { label: "En sevdiğin tek yere geri dön", note: "Bu sefer doğru dürüst gez", weights: { IT: 3 } },
      { label: "Suyu bul ve içinde kal", note: "Başka hiçbir şey yok", weights: { TH: 3 } },
      { label: "Bir mahalle daha gör", note: "Ayakların ağrıyana kadar yürü", weights: { US: 2, KR: 2 } },
    ],
  },
];

export default function TravelTest() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const done = step >= QUESTIONS.length;

  const result = useMemo(() => {
    if (!done) return null;
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return countries.find((c) => c.code === best?.[0]) ?? countries[0];
  }, [done, scores]);

  const choose = (opt: Option) => {
    setScores((prev) => {
      const next = { ...prev };
      for (const [code, w] of Object.entries(opt.weights)) {
        next[code] = (next[code] ?? 0) + (w ?? 0);
      }
      return next;
    });
    setStep((s) => s + 1);
  };

  const restart = () => {
    setScores({});
    setStep(0);
  };

  const progress = done ? 1 : step / QUESTIONS.length;

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#06090f]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% -10%,rgba(200,164,94,0.09) 0%,transparent 65%)",
        }}
      />

      {/* progress hairline */}
      <div className="fixed inset-x-0 top-0 z-50 h-px bg-white/[0.06]">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--gold)]/40 to-[var(--gold)]"
          animate={{ scaleX: progress }}
          initial={{ scaleX: 0 }}
          style={{ transformOrigin: "left" }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-3xl flex-col justify-center px-6 py-28 sm:px-10">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.section
              key={step}
              initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -26, filter: "blur(8px)" }}
              transition={{ duration: 0.65, ease: EASE_OUT }}
            >
              <p className="flex items-center gap-3 text-[11px] tracking-[0.4em] text-[var(--gold)]/70 uppercase">
                <span className="tabular-nums">{String(step + 1).padStart(2, "0")}</span>
                <span className="inline-block h-px w-8 bg-[var(--gold)]/30" />
                {QUESTIONS[step].kicker}
              </p>

              <h1 className="font-display mt-6 text-[clamp(2rem,5vw,3.4rem)] leading-[1.08] text-white">
                {QUESTIONS[step].prompt}
              </h1>

              <div className="mt-12 flex flex-col gap-3">
                {QUESTIONS[step].options.map((opt, i) => (
                  <motion.button
                    key={opt.label}
                    onClick={() => choose(opt)}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.12 + i * 0.07 }}
                    whileHover={{ x: 8 }}
                    className="group flex items-center justify-between gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-5 text-left backdrop-blur-sm transition-colors duration-500 hover:border-white/[0.16] hover:bg-white/[0.05]"
                  >
                    <span>
                      <span className="block text-[15.5px] text-white/90">{opt.label}</span>
                      <span className="mt-1 block text-[12.5px] text-white/35">{opt.note}</span>
                    </span>
                    <svg
                      className="h-4 w-4 shrink-0 text-white/25 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-[var(--gold)]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />
                    </svg>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          ) : (
            result && (
              <motion.section
                key="result"
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, ease: EASE_OUT }}
                className="text-center"
              >
                <p className="text-[11px] tracking-[0.46em] text-[var(--gold)]/70 uppercase">
                  Cam kenarın
                </p>

                <div className="relative mx-auto mt-8 aspect-[16/10] w-full max-w-md overflow-hidden rounded-[26px]">
                  <Image
                    src={result.image}
                    alt=""
                    fill
                    unoptimized={result.image.includes("upload.wikimedia.org")}
                    sizes="(max-width:640px) 100vw, 28rem"
                    className="object-cover"
                    priority
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-3xl">
                    {result.flag}
                  </span>
                </div>

                <h1 className="font-display mt-7 text-[clamp(2.6rem,8vw,4.4rem)] leading-none text-white">
                  {result.name}
                </h1>
                <p className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-white/50">
                  {result.description}
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.3 }}
                  className="mt-10 flex flex-wrap items-center justify-center gap-3"
                >
                  <Link
                    href={`/?fly=${result.code}`}
                    className="rounded-full bg-white px-7 py-3 text-[12px] font-medium tracking-[0.16em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
                  >
                    Hemen uç
                  </Link>
                  <button
                    onClick={restart}
                    className="rounded-full border border-white/12 px-7 py-3 text-[12px] tracking-[0.16em] text-white/60 uppercase transition-colors duration-500 hover:border-white/30 hover:text-white"
                  >
                    Baştan çöz
                  </button>
                </motion.div>
              </motion.section>
            )
          )}
        </AnimatePresence>

        {!done && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE_SOFT, delay: 0.6 }}
            className="mt-14 text-[11px] tracking-[0.3em] text-white/20 uppercase"
          >
            {QUESTIONS.length - step} soru kaldı &middot; yanlış cevap yok
          </motion.p>
        )}
      </div>
    </main>
  );
}
