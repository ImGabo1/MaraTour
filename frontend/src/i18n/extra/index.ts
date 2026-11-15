import { explore } from "./explore";
import { home } from "./home";
import { plan } from "./plan";
import { shell } from "./shell";

export const EXTRA_ES = { ...home.es, ...explore.es, ...plan.es, ...shell.es };
export const EXTRA_EN: Record<keyof typeof EXTRA_ES, string> = { ...home.en, ...explore.en, ...plan.en, ...shell.en };
export type ExtraKey = keyof typeof EXTRA_ES;
