import { useMemo, useState } from "react";
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
import "./auth.css";

interface Props {
  mode: "entrar" | "registro";
  onAuthenticated: (session: AuthSession) => void;
  onGuest: () => void;
}

export function AuthPage({ mode, onAuthenticated, onGuest }: Props) {
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
      setError("Las contraseñas no coinciden.");
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
          : "No pudimos completar el acceso. Inténtalo otra vez."
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
          <svg className="mta-brand__sun" viewBox="0 0 240 240" fill="none" aria-hidden="true">
            <circle cx="120" cy="120" r="118" fill="#FFE08A" opacity="0.45" />
            <g stroke="#FFC83D" strokeWidth="6" strokeLinecap="round">
              {Array.from({ length: 12 }, (_, i) => (
                <line key={i} x1="120" y1="22" x2="120" y2="40" transform={`rotate(${i * 30} 120 120)`} />
              ))}
            </g>
            <circle cx="120" cy="120" r="62" fill="#FFC83D" />
          </svg>

          <a className="mta-logo" href="#/bienvenida" aria-label="MaraTour · Volver a la portada">
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
              {isRegister ? "Crea tu cuenta" : "Bienvenido de vuelta"}
            </p>
            <h1>
              Tu próxima postal <span>empieza aquí</span>
            </h1>
            <p>Guarda tus lugares favoritos, arma rutas por Maracaibo y vuelve a ellas cuando quieras.</p>
          </div>

          <svg className="mta-brand__bridge" viewBox="0 0 1200 160" preserveAspectRatio="xMidYMax slice" fill="none" aria-hidden="true">
            <g stroke="currentColor" strokeLinecap="round">
              <path d="M0 120 H1200" strokeWidth="5" />
              <path d="M180 120 L218 24 H242 L280 120" strokeWidth="5" />
              <path d="M520 120 L568 8 H632 L680 120" strokeWidth="6" />
              <path d="M900 120 L938 24 H962 L1000 120" strokeWidth="5" />
            </g>
          </svg>
          <svg className="mta-brand__wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 40 C240 90 480 0 720 40 S1200 80 1440 30 V80 H0 Z" />
          </svg>
        </aside>

        {/* ===== Formulario de vidrio ===== */}
        <section className="mta-panel">
          <div className="mta-card glass">
            <a className="mta-back" href="#/bienvenida">
              <IconArrowLeft width={15} height={15} />
              Volver a la portada
            </a>

            <header className="mta-head">
              <p className="mta-kicker mta-kicker--sun">
                <IconSun width={14} height={14} />
                Tierra del Sol Amada
              </p>
              <h2>{isRegister ? "Crea tu cuenta" : "Ingresa a MaraTour"}</h2>
              <p>
                {isRegister
                  ? "Solo toma un momento. Guarda lugares y arma tu ruta ideal."
                  : "Continúa donde lo dejaste y descubre Maracaibo."}
              </p>
            </header>

            <div className={`mta-tabs${isRegister ? " is-register" : ""}`} role="tablist" aria-label="Acceso a MaraTour">
              <span className="mta-tabs__thumb" aria-hidden="true" />
              <a href={tabHref("entrar")} role="tab" aria-selected={!isRegister} className={!isRegister ? "is-active" : ""}>
                Entrar
              </a>
              <a href={tabHref("registro")} role="tab" aria-selected={isRegister} className={isRegister ? "is-active" : ""}>
                Registrarme
              </a>
            </div>

            <form className="mta-form" onSubmit={submit} noValidate>
              {isRegister && (
                <label className="mta-field">
                  <span className="mta-label">Nombre completo</span>
                  <span className="mta-control">
                    <IconUser width={18} height={18} aria-hidden="true" />
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Tu nombre y apellido"
                      autoComplete="name"
                      required
                    />
                  </span>
                </label>
              )}

              <label className="mta-field">
                <span className="mta-label">Correo electrónico</span>
                <span className="mta-control">
                  <IconMail width={18} height={18} aria-hidden="true" />
                  <input
                    type="email"
                    name="email"
                    inputMode="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    autoComplete="email"
                    spellCheck={false}
                    required
                  />
                </span>
              </label>

              <div className="mta-field">
                <label className="mta-label" htmlFor="mta-password">
                  Contraseña
                  {isRegister && <small>Mínimo 8 caracteres</small>}
                </label>
                <span className="mta-control">
                  <IconLock width={18} height={18} aria-hidden="true" />
                  <input
                    id="mta-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={isRegister ? "Crea una contraseña segura" : "Tu contraseña"}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    required
                  />
                  <button
                    type="button"
                    className="mta-eye"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
                    {strength <= 1 ? "Contraseña débil" : strength === 2 ? "Buena contraseña" : "Contraseña fuerte"}
                  </small>
                </div>
              )}

              {isRegister && (
                <label className="mta-field">
                  <span className="mta-label">Confirma tu contraseña</span>
                  <span className={`mta-control${mismatch ? " is-invalid" : ""}`}>
                    <IconLock width={18} height={18} aria-hidden="true" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirm"
                      value={confirm}
                      onChange={(event) => setConfirm(event.target.value)}
                      placeholder="Repite tu contraseña"
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
                    Un momento…
                  </>
                ) : (
                  <>
                    {isRegister ? "Registrarme" : "Entrar"}
                    <IconArrowRight width={18} height={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mta-divider">
              <span>no necesitas cuenta para explorar</span>
            </div>

            <button type="button" className="mt-btn mt-btn--soft mta-guest" onClick={onGuest}>
              <IconCompass width={17} height={17} />
              Explorar como invitado
            </button>

            <p className="mta-switch">
              {isRegister ? "¿Ya tienes una cuenta?" : "¿Aún no tienes una cuenta?"}{" "}
              <a href={isRegister ? "#/entrar" : "#/registro"}>{isRegister ? "Entra aquí" : "Regístrate gratis"}</a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
