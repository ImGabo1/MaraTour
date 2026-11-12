import { useI18n } from "../i18n/I18nProvider";
import { useTheme } from "../theme/ThemeProvider";
import { IconBolt, IconSun } from "./icons";

interface Props {
  className: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: Props) {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useI18n();
  const label = isDark ? t("theme.switchToLight") : t("theme.switchToDark");

  return (
    <button
      type="button"
      className={className}
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      {isDark ? <IconBolt width={18} height={20} /> : <IconSun width={18} height={18} />}
      {showLabel && <span>{label}</span>}
    </button>
  );
}
