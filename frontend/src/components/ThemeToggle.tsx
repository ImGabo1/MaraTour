import { useI18n } from "../i18n/I18nProvider";
import { useTheme } from "../theme/ThemeProvider";
import { IconMoon, IconSun } from "./icons";
import "./ThemeToggle.css";

interface Props {
  className: string;
  showLabel?: boolean;
  /** "icon": un solo icono (portadas y login). "switch": píldora sol/luna del header. */
  variant?: "icon" | "switch";
}

export function ThemeToggle({ className, showLabel = false, variant = "icon" }: Props) {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useI18n();
  const label = isDark ? t("theme.switchToLight") : t("theme.switchToDark");

  if (variant === "switch") {
    return (
      <button
        type="button"
        className={`mt-theme mt-focusable ${className}`.trim()}
        onClick={toggleTheme}
        aria-label={label}
        aria-pressed={isDark}
        title={label}
        data-dark={isDark ? "true" : "false"}
      >
        <span className="mt-theme__thumb" aria-hidden="true" />
        <span className={`mt-theme__slot${isDark ? "" : " is-on"}`} aria-hidden="true">
          <IconSun width={18} height={18} />
        </span>
        <span className={`mt-theme__slot${isDark ? " is-on" : ""}`} aria-hidden="true">
          <IconMoon width={18} height={18} />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      {isDark ? <IconMoon width={18} height={18} /> : <IconSun width={18} height={18} />}
      {showLabel && <span>{label}</span>}
    </button>
  );
}
