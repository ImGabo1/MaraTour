import { explore } from "./explore";
import { home } from "./home";
import { plan } from "./plan";
import { shell } from "./shell";

export const EXTRA_ES = { ...home.es, ...explore.es, ...plan.es, ...shell.es };
export const EXTRA_EN: Record<keyof typeof EXTRA_ES, string> = { ...home.en, ...explore.en, ...plan.en, ...shell.en };
export type ExtraKey = keyof typeof EXTRA_ES;

/** Traducciones de estas claves por idioma (./langs/<lang>.json). Lo que falte cae al inglés. */
const FILES = import.meta.glob("./langs/*.json", { eager: true, import: "default" }) as Record<
  string,
  Record<string, string>
>;
export const EXTRA_LANGS: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(FILES).map(([path, strings]) => [path.match(/langs\/(\w+)\.json$/)?.[1] ?? "", strings])
);
