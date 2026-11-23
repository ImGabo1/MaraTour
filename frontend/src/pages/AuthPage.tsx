import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCompass,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconSparkles,
  IconSun,
  IconUser,
} from "../components/icons";
import {
  AuthError,
  loginAccount,
  registerAccount,
  type AuthSession,
} from "../lib/auth";
import { CatatumboBolt, CelestialBody, UrdanetaBridge } from "../components/SkyMotifs";
import "./auth.css";

interface Props {
  mode: "entrar" | "registro";
  onAuthenticated: (session: AuthSession) => void;
  onGuest: () => void;
}

export function AuthPage({ mode, onAuthenticated, onGuest }: Props) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isRegister = mode === "registro";
  const strength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;
    return score;
  }, [password]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setTouched(true);
    if (isRegister && confirm !== password) {
      setError(t("shell.auth.passMismatch"));
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const session = isRegister
        ? await registerAccount({ name, email, password })
        : await loginAccount({ email, password });
      onAuthenticated(session);
    } catch (caught) {
      setError(
        caught instanceof AuthError
          ? caught.message
          : t("shell.auth.genericError")
      );
    } finally {
      setBusy(false);
    }
  };

  const mismatch = isRegister && touched && confirm.length > 0 && confirm !== password;
  const tabHref = (target: "entrar" | "registro") => `#/${target}`;

  return (
    <main className="mta-page mt-page-enter">
      <div className="mta-theme">
        <ThemeToggle variant="switch" className="mta-theme-toggle" />
      </div>

      <div className="mta-shell">
        {/* ===== Panel de marca: cielo, sol y puente ===== */}
        <aside className="mta-brand" aria-hidden="false">
          <CelestialBody className="mta-brand__sun" />
          <CatatumboBolt className="mta-brand__bolt" />

          <a className="mta-logo" href="#/bienvenida" aria-label={t("shell.auth.logoAria")}>
            <img src="/img/logo-emblema-192.png" alt="" width={46} height={46} />
            <span>
              <strong>
                Mara<b>Tour</b>
              </strong>
              <small>Visita Maracaibo</small>
            </span>
          </a>

          <div className="mta-brand__copy">
            <p className="mta-kicker">
              <IconSparkles width={14} height={14} />
              {isRegister ? t("shell.auth.kickerRegister") : t("shell.auth.kickerLogin")}
            </p>
            <h1>
              {t("shell.auth.heroA")} <span>{t("shell.auth.heroB")}</span>
            </h1>
            <p>{t("shell.auth.brandCopy")}</p>
          </div>

          <UrdanetaBridge className="mta-brand__bridge" />
          <svg className="mta-brand__wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 40 C240 90 480 0 720 40 S1200 80 1440 30 V80 H0 Z" />
          </svg>
        </aside>

        {/* ===== Formulario de vidrio ===== */}
        <section className="mta-panel">
          <div className="mta-card glass">
            <a className="mta-back" href="#/bienvenida">
              <IconArrowLeft width={15} height={15} />
              {t("shell.auth.back")}
            </a>

            <header className="mta-head">
              <p className="mta-kicker mta-kicker--sun">
                <IconSun width={14} height={14} />
                {t("shell.tagline")}
              </p>
              <h2>{isRegister ? t("shell.auth.headRegister") : t("shell.auth.headLogin")}</h2>
              <p>
                {isRegister
                  ? t("shell.auth.subRegister")
                  : t("shell.auth.subLogin")}
              </p>
            </header>

            <div className={`mta-tabs${isRegister ? " is-register" : ""}`} role="tablist" aria-label={t("shell.auth.tabsAria")}>
              <span className="mta-tabs__thumb" aria-hidden="true" />
              <a href={tabHref("entrar")} role="tab" aria-selected={!isRegister} className={!isRegister ? "is-active" : ""}>
                {t("shell.auth.tabLogin")}
              </a>
              <a href={tabHref("registro")} role="tab" aria-selected={isRegister} className={isRegister ? "is-active" : ""}>
                {t("shell.auth.tabRegister")}
              </a>
            </div>

            <form className="mta-form" onSubmit={submit} noValidate>
              {isRegister && (
                <label className="mta-field">
                  <span className="mta-label">{t("shell.auth.name")}</span>
                  <span className="mta-control">
                    <IconUser width={18} height={18} aria-hidden="true" />
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={t("shell.auth.namePh")}
                      autoComplete="name"
                      required
                    />
                  </span>
                </label>
              )}

              <label className="mta-field">
                <span className="mta-label">{t("shell.auth.email")}</span>
                <span className="mta-control">
                  <IconMail width={18} height={18} aria-hidden="true" />
                  <input
                    type="email"
                    name="email"
                    inputMode="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t("shell.auth.emailPh")}
                    autoComplete="email"
                    spellCheck={false}
                    required
                  />
                </span>
              </label>

              <div className="mta-field">
                <label className="mta-label" htmlFor="mta-password">
                  {t("shell.auth.password")}
                  {isRegister && <small>{t("shell.auth.min8")}</small>}
                </label>
                <span className="mta-control">
                  <IconLock width={18} height={18} aria-hidden="true" />
                  <input
                    id="mta-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={isRegister ? t("shell.auth.passPhRegister") : t("shell.auth.passPhLogin")}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    required
                  />
                  <button
                    type="button"
                    className="mta-eye"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? t("shell.auth.hide") : t("shell.auth.show")}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <IconEyeOff width={18} height={18} /> : <IconEye width={18} height={18} />}
                  </button>
                </span>
              </div>

              {isRegister && password && (
                <div className={`mta-strength is-${strength}`} aria-live="polite">
                  <span className="mta-strength__bars" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <small>
                    {strength <= 1 ? t("shell.auth.weak") : strength === 2 ? t("shell.auth.good") : t("shell.auth.strong")}
                  </small>
                </div>
              )}

              {isRegister && (
                <label className="mta-field">
                  <span className="mta-label">{t("shell.auth.confirm")}</span>
                  <span className={`mta-control${mismatch ? " is-invalid" : ""}`}>
                    <IconLock width={18} height={18} aria-hidden="true" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirm"
                      value={confirm}
                      onChange={(event) => setConfirm(event.target.value)}
                      placeholder={t("shell.auth.confirmPh")}
                      autoComplete="new-password"
                      aria-invalid={mismatch}
                      required
                    />
                  </span>
                </label>
              )}

              {error && (
                <p className="mta-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="mt-btn mt-btn--primary mta-submit" disabled={busy} aria-busy={busy}>
                {busy ? (
                  <>
                    <span className="mt-spinner" aria-hidden="true" />
                    {t("shell.auth.busy")}
                  </>
                ) : (
                  <>
                    {isRegister ? t("shell.auth.tabRegister") : t("shell.auth.tabLogin")}
                    <IconArrowRight width={18} height={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mta-divider">
              <span>{t("shell.auth.divider")}</span>
            </div>

            <button type="button" className="mt-btn mt-btn--soft mta-guest" onClick={onGuest}>
              <IconCompass width={17} height={17} />
              {t("shell.guestExplore")}
            </button>

            <p className="mta-switch">
              {isRegister ? t("shell.auth.haveAccount") : t("shell.auth.noAccount")}{" "}
              <a href={isRegister ? "#/entrar" : "#/registro"}>{isRegister ? t("shell.auth.enterHere") : t("shell.auth.signUpFree")}</a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
