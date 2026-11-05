import { useMemo, useState } from "react";
import { MaracaiboScene } from "../components/MaracaiboScene";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconMapPin,
  IconSparkles,
  IconSun,
  IconUser,
  IconUsers,
} from "../components/icons";
import {
  AuthError,
  loginAccount,
  registerAccount,
  type AuthSession,
} from "../lib/auth";

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
      setError(caught instanceof AuthError ? caught.message : "No pudimos completar el acceso. Inténtalo otra vez.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="vm-auth">
      <div className="vm-auth__sky" aria-hidden="true">
        <span className="vm-auth__glow vm-auth__glow--one" />
        <span className="vm-auth__glow vm-auth__glow--two" />
        <span className="vm-auth__sun" />
      </div>

      <div className="vm-auth__grid container">
        <section className="vm-auth__panel">
          <a className="vm-auth__back" href="#/bienvenida">
            <IconArrowLeft width={16} height={16} />
            Volver a la portada
          </a>

          <div className="vm-auth__brand">
            <span className="vm-auth__brand-mark">
              <IconSun width={24} height={24} />
            </span>
            <span>
              <strong>Maratur</strong>
              <small>Visita Maracaibo</small>
            </span>
          </div>

          <p className="vm-kicker">
            <IconSparkles width={15} height={15} />
            {isRegister ? "Tu primera vez en Maratur" : "Qué bueno verte otra vez"}
          </p>
          <h1 className="vm-auth__title">
            {isRegister ? "Crea tu cuenta y empieza a disfrutar" : "Entra y sigue tu ruta por Maracaibo"}
          </h1>
          <p className="vm-auth__lead">
            {isRegister
              ? "Guarda tus lugares favoritos, arma planes a tu medida y vuelve cuando quieras. Sin complicaciones."
              : "Tu ruta, tus lugares guardados y los planes que armaste te están esperando."}
          </p>

          <div className="vm-auth__tabs" role="tablist" aria-label="Acceso a Maratur">
            <a
              href="#/entrar"
              role="tab"
              aria-selected={!isRegister}
              className={!isRegister ? "is-active" : undefined}
            >
              Ingresar
            </a>
            <a
              href="#/registro"
              role="tab"
              aria-selected={isRegister}
              className={isRegister ? "is-active" : undefined}
            >
              Registrarme
            </a>
          </div>

          <form className="vm-auth__form" onSubmit={submit} noValidate>
            {isRegister && (
              <label className="vm-auth__field">
                <span>Nombre completo</span>
                <span className="vm-auth__control">
                  <IconUser width={18} height={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="¿Cómo te llamas?"
                    autoComplete="name"
                    required
                  />
                </span>
              </label>
            )}

            <label className="vm-auth__field">
              <span>Correo electrónico</span>
              <span className="vm-auth__control">
                <IconMail width={18} height={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                  required
                />
              </span>
            </label>

            <label className="vm-auth__field">
              <span>
                Contraseña
                {isRegister && <small>Mínimo 8 caracteres</small>}
              </span>
              <span className="vm-auth__control">
                <IconLock width={18} height={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={isRegister ? "Crea una contraseña segura" : "Tu contraseña"}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  required
                />
                <button
                  type="button"
                  className="vm-auth__eye"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <IconEyeOff width={18} height={18} /> : <IconEye width={18} height={18} />}
                </button>
              </span>
            </label>

            {isRegister && password && (
              <div className={`vm-auth__strength is-${strength}`} aria-live="polite">
                <span />
                <span />
                <span />
                <small>
                  {strength <= 1 ? "Contraseña débil" : strength === 2 ? "Buena contraseña" : "Contraseña fuerte"}
                </small>
              </div>
            )}

            {error && (
              <p className="vm-auth__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="vm-btn vm-btn--primary vm-btn--xl vm-auth__submit" disabled={busy}>
              {busy ? "Un momento…" : isRegister ? "Crear mi cuenta" : "Entrar a Maratur"}
              {!busy && <IconArrowRight width={18} height={18} />}
            </button>
          </form>

          <div className="vm-auth__divider">
            <span>o si prefieres</span>
          </div>

          <button type="button" className="vm-btn vm-btn--soft vm-auth__guest" onClick={onGuest}>
            <IconUsers width={18} height={18} />
            Explorar como invitado
          </button>

          <p className="vm-auth__switch">
            {isRegister ? "¿Ya tienes cuenta?" : "¿Todavía no tienes cuenta?"}{" "}
            <a href={isRegister ? "#/entrar" : "#/registro"}>
              {isRegister ? "Ingresa aquí" : "Regístrate gratis"}
            </a>
          </p>

          <p className="vm-auth__legal">
            <IconLock width={13} height={13} />
            Tu cuenta se guarda en el servidor. El modo invitado sigue siendo local.
          </p>
        </section>

        <aside className="vm-auth__aside" aria-label="Maracaibo te espera">
          <MaracaiboScene className="vm-auth__scene" />
          <div className="vm-auth__aside-copy">
            <p className="vm-auth__aside-kicker">
              <IconMapPin width={15} height={15} />
              Maracaibo · Zulia
            </p>
            <h2>La ciudad se disfruta mejor cuando sabes por dónde empezar.</h2>
            <ul>
              <li>
                <IconCheck width={16} height={16} />
                Fotos reales y vistas 360° de los lugares
              </li>
              <li>
                <IconCheck width={16} height={16} />
                Planes inteligentes según tu tiempo y presupuesto
              </li>
              <li>
                <IconCheck width={16} height={16} />
                Diccionario maracucho incluido
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
