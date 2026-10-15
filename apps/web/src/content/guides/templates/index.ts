import type { AppLocale } from "@/i18n/routing";
import type { GuideTemplates } from "./types";
import { tr } from "./tr";
import { en } from "./en";
import { de } from "./de";
import { ru } from "./ru";
import { es } from "./es";
import { fr } from "./fr";

export const GUIDE_TEMPLATES: Record<AppLocale, GuideTemplates> = { tr, en, de, ru, es, fr };
