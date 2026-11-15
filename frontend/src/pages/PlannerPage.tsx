import { useMemo, useState } from "react";
import { CATEGORIES, categoryBySlug, type CategorySlug } from "../data/categories";
import type { Diet } from "../data/food";
import { useI18n } from "../i18n/I18nProvider";
import type { MessageKey } from "../i18n/messages";
import {
  buildPlan,
  planSlugs,
  type Budget,
  type Companion,
  type Pace,
  type PlanResult,
} from "../lib/planner";
import type { Page } from "../hooks/usePageRoute";
import type { AuthSession } from "../lib/auth";
import type { Place } from "../types";
import { PlaceImage } from "../components/PlaceImage";
import "./PlanPages.css";
import { CategoryIcon, IconArrowRight, IconBulb, IconCalendar, IconCheck, IconClock, IconHeart, IconLeaf, IconRotate, IconRoute, IconSparkles, IconStar, IconUsers, IconWallet } from "../components/icons";

interface Props {
  places: readonly Place[];
  saved: readonly string[];
  session?: AuthSession | null;
  onOpenPlace: (slug: string) => void;
  onSavePlan: (slugs: readonly string[]) => void;
  onNavigate: (page: Page) => void;
}

const COMPANIONS: readonly { value: Companion; emoji: string }[] = [
  { value: "solo", emoji: "🎒" },
  { value: "pareja", emoji: "💛" },
  { value: "familia", emoji: "🏡" },
  { value: "amigos", emoji: "🎉" },
];

const PACES: readonly Pace[] = ["relajado", "equilibrado", "intenso"];

const BUDGETS: readonly Budget[] = ["$", "$$", "$$$"];

const DIETS: readonly { value: Diet; emoji: string }[] = [
  { value: "todos", emoji: "🍽️" },
  { value: "vegetariano", emoji: "🥬" },
  { value: "mariscos", emoji: "🦐" },
];

const FOOD_KEYS = ["breakfast", "lunch", "dinner", "sweet"] as const;

/** Sistema experto: convierte gustos, días y compañía en un plan completo con comidas. */
export function PlannerPage({ places, saved, session, onOpenPlace, onSavePlan, onNavigate }: Props) {
  const { t } = useI18n();
  const isGuest = !session || session.kind === "guest";
  const [step, setStep] = useState<0 | 1>(0);
  const [days, setDays] = useState(2);
  const [companion, setCompanion] = useState<Companion>("pareja");
  const [pace, setPace] = useState<Pace>("equilibrado");
  const [interests, setInterests] = useState<CategorySlug[]>(["historia", "gastronomia", "lago"]);
  const [budget, setBudget] = useState<Budget>("$$");
  const [diet, setDiet] = useState<Diet>("todos");
  const [want360, setWant360] = useState(true);
  const [wantNightlife, setWantNightlife] = useState(false);
  const [plan, setPlan] = useState<PlanResult | null>(null);

  const savedSet = useMemo(() => new Set(saved), [saved]);
  const planSaved = plan ? planSlugs(plan).every((slug) => savedSet.has(slug)) : false;

  const toggleInterest = (slug: CategorySlug) => {
    setInterests((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
    );
  };

  const generate = () => {
    const result = buildPlan(places, {
      days,
      companion,
      pace,
      interests: interests.length > 0 ? interests : ["cultura"],
      budget,
      diet,
      want360,
      wantNightlife,
    });
    setPlan(result);
    window.requestAnimationFrame(() => {
      document.getElementById("plan-resultado")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const reset = () => {
    setPlan(null);
    setStep(0);
  };

  return (
    <main className="mtn mt-page-enter">
      <section className="mtn-hero">
        <div className="mt-container">
          <p className="mtn-kicker">
            <IconSparkles width={15} height={15} />
            {t("plan.kicker")}
          </p>
          <h1 className="mtn-hero__title">
            {t("plan.title1")}<span>{t("plan.title2")}</span>
          </h1>
          <p className="mtn-hero__lead">
            {t("plan.lead")}
          </p>
        </div>
      </section>

      <div className="mt-container mtn-planner__layout">
        {!plan ? (
          <div className="mtn-wizard">
            {isGuest && (
              <div className="mtn-banner">
                <span>
                  <IconBulb width={16} height={16} aria-hidden="true" style={{ verticalAlign: "-3px" }} />{" "}
                  <strong>{t("plan.guest.title")}</strong> {t("plan.guest.body")}{" "}
                  <button type="button" className="mtn-link" onClick={() => onNavigate("registro")}>
                    {t("plan.guest.cta")}
                  </button>.
                </span>
              </div>
            )}
            <div className="mtn-wizard__steps" aria-label={t("plan.steps.aria")}>
              <span className={step >= 0 ? "is-active" : undefined}>
                <b>1</b> {t("plan.steps.trip")}
              </span>
              <span className={step >= 1 ? "is-active" : undefined}>
                <b>2</b> {t("plan.steps.taste")}
              </span>
              <span>
                <b>3</b> {t("plan.steps.plan")}
              </span>
            </div>

            {step === 0 ? (
              <section className="mtn-wizard__panel">
                <div className="mtn-wizard__head">
                  <p className="mtn-kicker">{t("plan.step1")}</p>
                  <h2>{t("plan.s1.title")}</h2>
                  <p>{t("plan.s1.lead")}</p>
                </div>

                <div className="mtn-field">
                  <span className="mtn-field__label">
                    <IconCalendar width={17} height={17} />
                    {t("plan.days.q")}
                  </span>
                  <div className="mtn-daypick">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={days === value ? "is-active" : undefined}
                        onClick={() => setDays(value)}
                      >
                        <b>{value}</b>
                        <span>{value === 1 ? t("plan.day.one") : t("plan.day.many")}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mtn-field">
                  <span className="mtn-field__label">
                    <IconUsers width={17} height={17} />
                    {t("plan.with.q")}
                  </span>
                  <div className="mtn-options mtn-options--four">
                    {COMPANIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`mtn-option${companion === option.value ? " is-active" : ""}`}
                        onClick={() => setCompanion(option.value)}
                      >
                        <span className="mtn-option__emoji" aria-hidden="true">
                          {option.emoji}
                        </span>
                        <strong>{t(`plan.with.${option.value}` as MessageKey)}</strong>
                        <small>{t(`plan.with.${option.value}.hint` as MessageKey)}</small>
                        {companion === option.value && <IconCheck width={15} height={15} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mtn-field">
                  <span className="mtn-field__label">
                    <IconClock width={17} height={17} />
                    {t("plan.pace.q")}
                  </span>
                  <div className="mtn-options mtn-options--three">
                    {PACES.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`mtn-option mtn-option--compact${pace === option ? " is-active" : ""}`}
                        onClick={() => setPace(option)}
                      >
                        <strong>{t(`plan.pace.${option}` as MessageKey)}</strong>
                        <small>{t(`plan.pace.${option}.hint` as MessageKey)}</small>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mtn-wizard__actions">
                  <span />
                  <button type="button" className="mt-btn mt-btn--primary" onClick={() => setStep(1)}>
                    {t("plan.next")}
                    <IconArrowRight width={17} height={17} />
                  </button>
                </div>
              </section>
            ) : (
              <section className="mtn-wizard__panel">
                <div className="mtn-wizard__head">
                  <p className="mtn-kicker">{t("plan.step2")}</p>
                  <h2>{t("plan.s2.title")}</h2>
                  <p>{t("plan.s2.lead")}</p>
                </div>

                <div className="mtn-field">
                  <span className="mtn-field__label">
                    <IconHeart width={17} height={17} />
                    {t("plan.interests")}
                  </span>
                  <div className="mtn-interest-grid">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.slug}
                        type="button"
                        className={`mtn-interest${interests.includes(category.slug) ? " is-active" : ""}`}
                        style={{
                          ["--from" as string]: category.from,
                          ["--to" as string]: category.to,
                          ["--soft" as string]: category.soft,
                        }}
                        onClick={() => toggleInterest(category.slug)}
                        aria-pressed={interests.includes(category.slug)}
                      >
                        <span className="mtn-interest__icon">
                          <CategoryIcon name={category.icon} width={18} height={18} />
                        </span>
                        <span className="mtn-interest__copy">
                          <strong>{t(category.nameKey)}</strong>
                          <small>{t(`plan.blurb.${category.slug}` as MessageKey)}</small>
                        </span>
                        {interests.includes(category.slug) && <IconCheck width={14} height={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mtn-field">
                  <span className="mtn-field__label">
                    <IconWallet width={17} height={17} />
                    {t("plan.budget")}
                  </span>
                  <div className="mtn-options mtn-options--three">
                    {BUDGETS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`mtn-option mtn-option--compact${budget === option ? " is-active" : ""}`}
                        onClick={() => setBudget(option)}
                      >
                        <strong>
                          {option} · {t(`plan.budget.${option}` as MessageKey)}
                        </strong>
                        <small>{t(`plan.budget.${option}.hint` as MessageKey)}</small>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mtn-field">
                  <span className="mtn-field__label">
                    <IconLeaf width={17} height={17} />
                    {t("plan.diet.q")}
                  </span>
                  <div className="mtn-options mtn-options--three">
                    {DIETS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`mtn-option mtn-option--compact${diet === option.value ? " is-active" : ""}`}
                        onClick={() => setDiet(option.value)}
                      >
                        <strong>
                          <span aria-hidden="true">{option.emoji}</span> {t(`plan.diet.${option.value}` as MessageKey)}
                        </strong>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mtn-toggles">
                  <button
                    type="button"
                    className={`mtn-toggle${want360 ? " is-active" : ""}`}
                    aria-pressed={want360}
                    onClick={() => setWant360((value) => !value)}
                  >
                    <IconRotate width={18} height={18} />
                    <span>
                      <strong>{t("plan.want360")}</strong>
                      <small>{t("plan.want360.hint")}</small>
                    </span>
                    <i aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={`mtn-toggle${wantNightlife ? " is-active" : ""}`}
                    aria-pressed={wantNightlife}
                    onClick={() => setWantNightlife((value) => !value)}
                  >
                    <IconStar width={18} height={18} />
                    <span>
                      <strong>{t("plan.nightlife")}</strong>
                      <small>{t("plan.nightlife.hint")}</small>
                    </span>
                    <i aria-hidden="true" />
                  </button>
                </div>

                <div className="mtn-wizard__actions">
                  <button type="button" className="mt-btn mt-btn--soft" onClick={() => setStep(0)}>
                    {t("plan.back")}
                  </button>
                  <button type="button" className="mt-btn mt-btn--primary" onClick={generate}>
                    <IconSparkles width={17} height={17} />
                    {t("plan.create")}
                  </button>
                </div>
              </section>
            )}
          </div>
        ) : (
          <PlanResultView
            plan={plan}
            planSaved={planSaved}
            isGuest={isGuest}
            onOpenPlace={onOpenPlace}
            onSave={() => onSavePlan(planSlugs(plan))}
            onReset={reset}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </main>
  );
}

function PlanResultView({
  plan,
  planSaved,
  isGuest,
  onOpenPlace,
  onSave,
  onReset,
  onNavigate,
}: {
  plan: PlanResult;
  planSaved: boolean;
  isGuest: boolean;
  onOpenPlace: (slug: string) => void;
  onSave: () => void;
  onReset: () => void;
  onNavigate: (page: Page) => void;
}) {
  const { t } = useI18n();
  return (
    <section id="plan-resultado" className="mtn-result">
      {isGuest && (
        <div className="mtn-notice">
          <span className="mtn-notice__icon" aria-hidden="true">
            <IconBulb width={22} height={22} />
          </span>
          <div className="mtn-notice__text">
            <strong>{t("plan.guest.title")}</strong>
            <p>{t("plan.guest.body")}</p>
          </div>
          <button
            type="button"
            className="mt-btn mt-btn--primary"
            onClick={() => onNavigate("registro")}
          >
            {t("plan.guest.cta")}
          </button>
        </div>
      )}
      <header className="mtn-result__hero">
        <div className="mtn-result__score">
          <span style={{ ["--score" as string]: plan.score }}>
            <b>{plan.score}%</b>
          </span>
          <small>{t("plan.score")}</small>
        </div>
        <div className="mtn-result__copy">
          <p className="mtn-kicker">{t("plan.ready")}</p>
          <h2>{plan.days.length === 1 ? t("plan.oneday") : t("plan.ndays", { n: plan.days.length })}</h2>
          <p>{plan.summary}</p>
          <div className="mtn-result__tags">
            {plan.tags.map((tag) => {
              const category = categoryBySlug(tag);
              if (!category) return null;
              return (
                <span key={tag} style={{ ["--from" as string]: category.from, ["--to" as string]: category.to }}>
                  <CategoryIcon name={category.icon} width={13} height={13} />
                  {t(category.nameKey)}
                </span>
              );
            })}
          </div>
        </div>
        <div className="mtn-result__actions">
          <button type="button" className="mt-btn mt-btn--primary" onClick={onSave} disabled={planSaved}>
            <IconHeart width={17} height={17} />
            {planSaved ? t("plan.saved") : t("plan.save")}
          </button>
          <button type="button" className="mt-btn mt-btn--soft" onClick={() => onNavigate("mi-ruta")}>
            <IconRoute width={17} height={17} />
            {t("plan.openroute")}
          </button>
          <button type="button" className="mt-btn mt-btn--soft" onClick={onReset}>
            {t("plan.adjust")}
          </button>
        </div>
      </header>

      <div className="mtn-days">
        {plan.days.map((day) => (
          <article key={day.day} className="mtn-day">
            <header className="mtn-day__head">
              <span className="mtn-day__number">{String(day.day).padStart(2, "0")}</span>
              <div>
                <p className="mtn-kicker">{t("plan.dayn", { n: day.day })}</p>
                <h3>{day.title}</h3>
              </div>
              <span className="mtn-day__count">
                {day.stops.length} {day.stops.length === 1 ? t("plan.stop.one") : t("plan.stop.many")}
              </span>
            </header>

            <div className="mtn-day__timeline">
              {day.stops.map((stop) => {
                const category = categoryBySlug(stop.place.category);
                return (
                  <button
                    key={stop.place.slug}
                    type="button"
                    className="mtn-stop"
                    onClick={() => onOpenPlace(stop.place.slug)}
                  >
                    <span className="mtn-stop__time">
                      <IconClock width={13} height={13} />
                      {t(`plan.slot.${stop.slot}` as MessageKey)}
                    </span>
                    <span className="mtn-stop__media">
                      <PlaceImage place={stop.place} ratio="thumb" decorative />
                    </span>
                    <span className="mtn-stop__body">
                      <strong>{stop.place.name}</strong>
                      <small>{stop.reason}</small>
                      <span className="mtn-stop__meta">
                        {category && (
                          <span
                            className="mtn-stop__cat"
                            style={{ ["--from" as string]: category.from, ["--to" as string]: category.to }}
                          >
                            {stop.place.categoryName}
                          </span>
                        )}
                        {stop.place.panoUrl && (
                          <span className="mtn-stop__pano">
                            <IconRotate width={12} height={12} />
                            360°
                          </span>
                        )}
                      </span>
                    </span>
                    <IconArrowRight width={17} height={17} />
                  </button>
                );
              })}
            </div>

            <div className="mtn-day__food">
              <p className="mtn-day__food-title">
                <IconSparkles width={15} height={15} />
                {t("plan.flavors")}
              </p>
              <div className="mtn-food-grid">
                {Object.entries(day.food).map(([key, spot]) => (
                  <div key={key} className="mtn-food">
                    <span>{(FOOD_KEYS as readonly string[]).includes(key) ? t(`plan.food.${key}` as MessageKey) : key}</span>
                    <strong>{spot.dish}</strong>
                    <small>{spot.where}</small>
                    <b>{spot.price}</b>
                  </div>
                ))}
              </div>
            </div>

            <p className="mtn-day__tip">
              <IconBulb width={16} height={16} />
              {day.tip}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
