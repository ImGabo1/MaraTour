import { useMemo, useState } from "react";
import { WELCOME_SLIDES } from "../data/welcome";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBoat,
  IconChinita,
  IconCompass,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconMapPin,
  IconSparkles,
  IconSun,
  IconUser,
  IconWave,
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

  const chinita = WELCOME_SLIDES[0]!;
  const bridge = WELCOME_SLIDES[2] ?? chinita;
  const vereda = WELCOME_SLIDES[1] ?? chinita;

  return (
    <main className="va-page">
      {/* ===== Fondo tropical animado ===== */}
      <div className="va-bg" aria-hidden="true">
        <span className="va-aurora va-aurora--1" />
        <span className="va-aurora va-aurora--2" />
        <span className="va-aurora va-aurora--3" />

        <div className="va-sun">
          <span className="va-sun__glow" />
          <span className="va-sun__rays" />
          <span className="va-sun__core" />
        </div>

        <span className="va-cloud va-cloud--1" />
        <span className="va-cloud va-cloud--2" />

        <div className="va-tokens">
          <span className="va-token va-token--1">
            <IconChinita width={20} height={20} />
          </span>
          <span className="va-token va-token--2">
            <IconBoat width={20} height={20} />
          </span>
          <span className="va-token va-token--3">
            <IconWave width={20} height={20} />
          </span>
          <span className="va-token va-token--4">
            <IconSun width={18} height={18} />
          </span>
        </div>

        <div className="va-lake">
          <span className="va-lake__wave va-lake__wave--1" />
          <span className="va-lake__wave va-lake__wave--2" />
          <svg
            className="va-lake__bridge"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
          >
            <path
              d="M0 150C220 128 340 74 480 72s240 58 440 26 300-42 520 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              d="M210 132V58M226 130V58M690 92V32M706 90V32M1160 96V38M1176 94V38"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
        </div>
      </div>

      <div className="va-theme-toggle-wrap">
        <ThemeToggle className="va-theme-toggle-button" />
      </div>

      <div className="va-shell">
        {/* ===== Columna visual ===== */}
        <aside className="va-aside">
          <a className="va-brand" href="#/bienvenida" aria-label="Maratour · Volver a la portada">
            <span className="va-brand__mark" aria-hidden="true">
              <img src="/img/logo-emblema-192.png" alt="" width={46} height={46} />
            </span>
            <span className="va-brand__text">
              <strong>Maratour</strong>
              <small>Visita Maracaibo</small>
            </span>
          </a>

          <div className="va-aside__copy">
            <p className="va-kicker">
              <IconSparkles width={14} height={14} />
              {isRegister ? "Crea tu cuenta" : "Bienvenido de vuelta"}
            </p>
            <h1 className="va-aside__title">
              Tu próxima postal
              <span>empieza aquí</span>
            </h1>
            <p className="va-aside__lead">
              Guarda tus lugares favoritos, arma rutas por Maracaibo y vuelve a
              ellas cuando quieras. La ciudad te espera a todo color.
            </p>
          </div>

          <div className="va-postcards" aria-hidden="true">
            <figure className="va-postcards__item va-postcards__item--one">
              <img src={chinita.src} alt="" loading="lazy" decoding="async" />
              <figcaption>Basílica de la Chinita</figcaption>
            </figure>
            <figure className="va-postcards__item va-postcards__item--two">
              <img src={bridge.src} alt="" loading="lazy" decoding="async" />
              <figcaption>Puente sobre el Lago</figcaption>
            </figure>
            <figure className="va-postcards__item va-postcards__item--three">
              <img src={vereda.src} alt="" loading="lazy" decoding="async" />
              <figcaption>Vereda del Lago</figcaption>
            </figure>
            <span className="va-postcards__pin">
              <IconMapPin width={16} height={16} />
              Maracaibo
            </span>
          </div>

          <ul className="va-stats">
            <li>
              <strong>43</strong>
              <span>lugares</span>
            </li>
            <li>
              <strong>7</strong>
              <span>rutas</span>
            </li>
            <li>
              <strong>100%</strong>
              <span>gratis</span>
            </li>
          </ul>
        </aside>

        {/* ===== Columna del formulario ===== */}
        <section className="va-panel">
          <a className="va-panel__brand" href="#/bienvenida" aria-label="Maratour · Volver a la portada">
            <span className="va-brand__mark" aria-hidden="true">
              <img src="/img/logo-emblema-192.png" alt="" width={40} height={40} />
            </span>
            <span className="va-brand__text">
              <strong>Maratour</strong>
              <small>Visita Maracaibo</small>
            </span>
          </a>

          <div className="va-card">
            <a className="va-back" href="#/bienvenida">
              <IconArrowLeft width={15} height={15} />
              Volver a la portada
            </a>

            <header className="va-head">
              <p className="va-head__kicker">
                <IconSun width={14} height={14} />
                Tierra del Sol Amada
              </p>
              <h2 className="va-head__title">
                {isRegister ? "Crea tu cuenta" : "Ingresa a Maratour"}
              </h2>
              <p className="va-head__lead">
                {isRegister
                  ? "Solo toma un momento. Guarda lugares y arma tu ruta ideal."
                  : "Continúa donde lo dejaste y descubre Maracaibo a todo color."}
              </p>
            </header>

            <div className="va-tabs" role="tablist" aria-label="Acceso a Maratour">
              <a
                href="#/registro"
                role="tab"
                aria-selected={isRegister}
                className={`va-tab${isRegister ? " is-active" : ""}`}
              >
                Registrarme
              </a>
              <a
                href="#/entrar"
                role="tab"
                aria-selected={!isRegister}
                className={`va-tab${!isRegister ? " is-active" : ""}`}
              >
                Ingresar
              </a>
            </div>

            <form className="va-form" onSubmit={submit} noValidate>
              {isRegister && (
                <label className="va-field">
                  <span className="va-label">Nombre completo</span>
                  <span className="va-control">
                    <IconUser width={18} height={18} />
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

              <label className="va-field">
                <span className="va-label">Correo electrónico</span>
                <span className="va-control">
                  <IconMail width={18} height={18} />
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

              <label className="va-field">
                <span className="va-label">
                  Contraseña
                  {isRegister && <small>Mínimo 8 caracteres</small>}
                </span>
                <span className="va-control">
                  <IconLock width={18} height={18} />
                  <input
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
                    className="va-eye"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <IconEyeOff width={18} height={18} /> : <IconEye width={18} height={18} />}
                  </button>
                </span>
              </label>

              {isRegister && password && (
                <div className={`va-strength is-${strength}`} aria-live="polite">
                  <div className="va-strength__bars">
                    <span />
                    <span />
                    <span />
                  </div>
                  <small>
                    {strength <= 1
                      ? "Contraseña débil"
                      : strength === 2
                        ? "Buena contraseña"
                        : "Contraseña fuerte"}
                  </small>
                </div>
              )}

              {error && (
                <p className="va-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="va-submit" disabled={busy}>
                <span>
                  {busy
                    ? "Un momento…"
                    : isRegister
                      ? "Crear mi cuenta gratis"
                      : "Entrar a Maratour"}
                </span>
                {!busy && <IconArrowRight width={18} height={18} />}
              </button>
            </form>

            <div className="va-divider">
              <span>o entra sin registrarte</span>
            </div>

            <button type="button" className="va-guest" onClick={onGuest}>
              <IconCompass width={17} height={17} />
              Explorar como invitado
            </button>

            <p className="va-switch">
              {isRegister
                ? "¿Ya tienes una cuenta registrada?"
                : "¿Aún no tienes una cuenta?"}{" "}
              <a href={isRegister ? "#/entrar" : "#/registro"}>
                {isRegister ? "Inicia sesión aquí" : "Regístrate gratis"}
              </a>
            </p>
          </div>

          <p className="va-footnote">
            <IconSun width={12} height={12} />
            Maracaibo, Zulia · Venezuela
          </p>
        </section>
      </div>
    </main>
  );
}
