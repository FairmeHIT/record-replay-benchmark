import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  CloudSun,
  Code2,
  Download,
  ExternalLink,
  Home,
  Image,
  Languages,
  Link2,
  ListChecks,
  Moon,
  MousePointerClick,
  RefreshCcw,
  ShoppingBag,
  Sun,
  Train,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BrowserLabView } from "./apps/BrowserLab";
import { CodeHostingView } from "./apps/CodeHosting";
import { ControlBenchmarkView } from "./apps/ControlBenchmark";
import { ContentReviewView } from "./apps/ContentReview";
import { ProfileFormView, TableApprovalView } from "./apps/ControlLab";
import { StorefrontView } from "./apps/Storefront";
import { TicketBookingView } from "./apps/TicketBooking";
import {
  appNameText,
  difficultyText,
  eventTypeText,
  featureModulesText,
  localeNames,
  localizedEvaluation,
  localizedInstruction,
  localizedTask,
  shellText,
  weatherText,
  type Locale,
} from "./lib/localization";
import { findTask, tasks } from "./lib/tasks";
import type { AppId, EvaluationResult, EventRecord, TaskState } from "./lib/types";

declare global {
  interface Window {
    __recordReplayDemo?: {
      taskId: string;
      seed: number;
      state: TaskState;
      evaluate: () => EvaluationResult;
      report: () => BenchmarkReport;
      events: EventRecord[];
    };
  }
}

interface BenchmarkReport {
  task_id: string;
  seed: number;
  instruction: string;
  duration_ms: number;
  evaluation: EvaluationResult;
  events: EventRecord[];
  state: TaskState;
}

const appIcons: Record<AppId, typeof ClipboardCheck> = {
  "control-lab": ClipboardCheck,
  tickets: Train,
  storefront: ShoppingBag,
  "code-hosting": Code2,
  "browser-lab": MousePointerClick,
  "content-review": Image,
  "control-benchmark": Zap,
};

type Theme = "light" | "dark";
const themeOptions = ["light", "dark"] as const;
const localeOptions = ["zh", "en"] as const;

function eventId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function taskCode(index: number): string {
  return `T${String(index + 1).padStart(2, "0")}`;
}

function readVisitCount(): number {
  const base = 1800 + new Date().getDate() * 17;
  try {
    const key = "record-replay-demo-visit-count";
    const current = Number(window.localStorage.getItem(key) ?? "0");
    const next = Number.isFinite(current) ? current + 1 : 1;
    window.localStorage.setItem(key, String(next));
    return base + next;
  } catch {
    return base + 1;
  }
}

function readPreference<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
  try {
    const stored = window.localStorage.getItem(key) as T | null;
    return stored && allowed.includes(stored) ? stored : fallback;
  } catch {
    return fallback;
  }
}

function readInitialRoute() {
  const params = new URLSearchParams(window.location.search);
  const task = params.get("task");
  const seedValue = params.get("seed");
  const seedParam = seedValue === null ? Number.NaN : Number(seedValue);
  const hasValidTask = Boolean(task && tasks.some((item) => item.id === task));
  return {
    isHome: !hasValidTask,
    taskId: hasValidTask && task ? task : tasks[0].id,
    seed: Number.isFinite(seedParam) ? seedParam : 42,
  };
}

function App() {
  const initialRoute = useMemo(readInitialRoute, []);
  const [isHome, setIsHome] = useState(initialRoute.isHome);
  const [taskId, setTaskId] = useState(initialRoute.taskId);
  const [seed, setSeed] = useState(initialRoute.seed);
  const definition = useMemo(() => findTask(taskId), [taskId]);
  const [taskState, setTaskState] = useState<TaskState>(() => definition.createState(seed));
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [theme, setTheme] = useState<Theme>(() => readPreference<Theme>("record-replay-theme", "light", themeOptions));
  const [locale, setLocale] = useState<Locale>(() => readPreference<Locale>("record-replay-locale", "zh", localeOptions));
  const [toast, setToast] = useState<string>(shellText[locale].taskReady);
  const [visitCount] = useState(readVisitCount);
  const text = shellText[locale];

  const currentTaskCopy = localizedTask(definition, locale);
  const instruction = localizedInstruction(definition, taskState, locale);
  const rawLiveEvaluation = useMemo(() => definition.evaluate(taskState), [definition, taskState]);
  const liveEvaluation = useMemo(
    () => localizedEvaluation(taskId, rawLiveEvaluation, locale),
    [locale, rawLiveEvaluation, taskId],
  );
  const displayedEvaluation = evaluation ? localizedEvaluation(taskId, evaluation, locale) : liveEvaluation;
  const shouldShowResultBanner = Boolean(evaluation) || liveEvaluation.success;
  const todayText = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
        dateStyle: "full",
      }).format(new Date()),
    [locale],
  );
  const numberedTasks = useMemo(
    () => tasks.map((task, index) => ({ task, code: taskCode(index) })),
    [],
  );
  const groupedTasks = useMemo(() => {
    return numberedTasks.reduce<Partial<Record<AppId, typeof numberedTasks>>>((groups, item) => {
      const next = groups[item.task.appId] ?? [];
      return { ...groups, [item.task.appId]: [...next, item] };
    }, {});
  }, [numberedTasks]);
  const difficultyCounts = useMemo(
    () => ({
      easy: tasks.filter((task) => task.difficulty === "easy").length,
      medium: tasks.filter((task) => task.difficulty === "medium").length,
      hard: tasks.filter((task) => task.difficulty === "hard").length,
    }),
    [],
  );

  const createReport = (): BenchmarkReport => ({
    task_id: taskId,
    seed,
    instruction,
    duration_ms: Date.now() - startedAt,
    evaluation: evaluation ?? definition.evaluate(taskState),
    events,
    state: taskState,
  });

  useEffect(() => {
    window.__recordReplayDemo = {
      taskId,
      seed,
      state: taskState,
      evaluate: () => definition.evaluate(taskState),
      report: createReport,
      events,
    };
  }, [definition, evaluation, events, instruction, seed, startedAt, taskId, taskState]);

  useEffect(() => {
    const nextUrl = new URL(window.location.href);
    if (isHome) {
      nextUrl.searchParams.delete("task");
      nextUrl.searchParams.delete("seed");
    } else {
      nextUrl.searchParams.set("task", taskId);
      nextUrl.searchParams.set("seed", String(seed));
    }
    window.history.replaceState({}, "", nextUrl);
  }, [isHome, seed, taskId]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem("record-replay-theme", theme);
    } catch {
      // Ignore blocked storage; the visible switch still works for this session.
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    try {
      window.localStorage.setItem("record-replay-locale", locale);
    } catch {
      // Ignore blocked storage; the visible switch still works for this session.
    }
  }, [locale]);

  const recordEvent = (
    label: string,
    type: EventRecord["type"],
    metadata?: EventRecord["metadata"],
  ) => {
    setEvents((current) => [
      {
        id: eventId(),
        taskId,
        seed,
        at: new Date().toISOString(),
        type,
        label,
        metadata,
      },
      ...current,
    ]);
  };

  const resetTask = (nextTaskId = taskId, nextSeed = seed) => {
    const nextDefinition = findTask(nextTaskId);
    const nextState = nextDefinition.createState(nextSeed);
    setIsHome(false);
    setTaskId(nextTaskId);
    setSeed(nextSeed);
    setTaskState(nextState);
    setEvaluation(null);
    setEvents([
      {
        id: eventId(),
        taskId: nextTaskId,
        seed: nextSeed,
        at: new Date().toISOString(),
        type: "reset",
        label: text.resetTask,
      },
    ]);
    setStartedAt(Date.now());
    setToast(`${text.resetTask}: ${localizedTask(nextDefinition, locale).title}, seed ${nextSeed}`);
  };

  const handleTaskChange = (nextTaskId: string) => {
    resetTask(nextTaskId, seed);
  };

  const handleSeedChange = (value: number) => {
    const nextSeed = Number.isFinite(value) ? value : 1;
    if (isHome) {
      setSeed(nextSeed);
      setTaskState(definition.createState(nextSeed));
      setEvaluation(null);
      setEvents([]);
      setStartedAt(Date.now());
      setToast(`${text.seedChanged} ${nextSeed}`);
      return;
    }
    resetTask(taskId, nextSeed);
  };

  const goHome = () => {
    setIsHome(true);
    setEvaluation(null);
    setToast(text.returnedHome);
  };

  const updateTaskState = <TState extends TaskState>(
    next: TState,
    label: string,
    type: EventRecord["type"] = "input",
  ) => {
    setTaskState(next);
    setEvaluation(null);
    setToast(label);
    recordEvent(label, type);
  };

  const evaluate = () => {
    const nextEvaluation = definition.evaluate(taskState);
    setEvaluation(nextEvaluation);
    setToast(nextEvaluation.success ? text.evalPassed : text.evalFailed);
    recordEvent(nextEvaluation.success ? text.evalPassed : text.evalFailed, "evaluation", {
      score: nextEvaluation.score,
    });
  };

  const exportReport = () => {
    const report = createReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${taskId.replaceAll(".", "-")}-${seed}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setToast(text.reportExported);
  };

  const handleThemeChange = (nextTheme: Theme) => {
    setTheme(nextTheme);
    setToast(nextTheme === "dark" ? text.dark : text.light);
  };

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocale(nextLocale);
    setToast(shellText[nextLocale].taskReady);
  };

  const shareUrl = `${window.location.origin}${window.location.pathname}?task=${encodeURIComponent(taskId)}&seed=${seed}`;

  const renderTask = () => {
    switch (taskState.kind) {
      case "profile-form":
        return <ProfileFormView locale={locale} state={taskState} onChange={updateTaskState} />;
      case "table-approval":
        return <TableApprovalView locale={locale} state={taskState} onChange={updateTaskState} />;
      case "ticket-booking":
        return <TicketBookingView locale={locale} seed={seed} state={taskState} onChange={updateTaskState} />;
      case "storefront-checkout":
        return <StorefrontView locale={locale} state={taskState} onChange={updateTaskState} />;
      case "code-hosting":
        return <CodeHostingView locale={locale} state={taskState} onChange={updateTaskState} />;
      case "browser-lab":
        return <BrowserLabView locale={locale} state={taskState} onChange={updateTaskState} />;
      case "media-review":
        return <ContentReviewView locale={locale} state={taskState} onChange={updateTaskState} />;
      case "control-benchmark":
        return <ControlBenchmarkView locale={locale} state={taskState} onChange={updateTaskState} />;
      default:
        return null;
    }
  };

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label={text.homeOverview}>
        <button className="brand-block brand-button" type="button" onClick={goHome}>
          <div className="brand-mark">
            <Activity size={23} />
          </div>
          <div>
            <h1>{text.brandTitle}</h1>
            <p>{text.brandSubtitle}</p>
          </div>
        </button>

        <div className="seed-control">
          <label>
            <span>{text.seed}</span>
            <input
              type="number"
              value={seed}
              onChange={(event) => handleSeedChange(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="difficulty-summary" aria-label={text.taskNumber}>
          <span>
            <strong>{difficultyCounts.easy}</strong>
            {difficultyText.easy[locale]}
          </span>
          <span>
            <strong>{difficultyCounts.medium}</strong>
            {difficultyText.medium[locale]}
          </span>
          <span>
            <strong>{difficultyCounts.hard}</strong>
            {difficultyText.hard[locale]}
          </span>
        </div>

        <nav className="task-nav">
          <section>
            <h2>{text.home}</h2>
            <button className={isHome ? "task-tab active" : "task-tab"} type="button" onClick={goHome}>
              <Home size={17} />
              <span>{text.homeOverview}</span>
              <small>{text.entry}</small>
            </button>
          </section>
          {Object.entries(groupedTasks).map(([appId, appTasks]) => (
            <section key={appId}>
              <h2>{appNameText[appId as AppId][locale]}</h2>
              {appTasks.map(({ task, code }) => {
                const Icon = appIcons[task.appId];
                const taskCopy = localizedTask(task, locale);
                return (
                  <button
                    className={!isHome && task.id === taskId ? "task-tab active" : "task-tab"}
                    key={task.id}
                    type="button"
                    onClick={() => handleTaskChange(task.id)}
                  >
                    <Icon size={17} />
                    <span>
                      <strong>{code}</strong>
                      {taskCopy.title}
                    </span>
                    <small>{difficultyText[task.difficulty][locale]}</small>
                  </button>
                );
              })}
            </section>
          ))}
        </nav>
      </aside>

      <section className="main-stage">
        <section className="live-strip" aria-label={text.liveInfo}>
          <span>
            <CalendarDays size={16} />
            {todayText}
          </span>
          <span>
            <Users size={16} />
            {text.todayVisits} {visitCount}
          </span>
          <div className="weather-ticker" aria-label={text.weatherRunning}>
            <CloudSun size={16} />
            <div>
              <p>
                {[...weatherText[locale], ...weatherText[locale]].map((item, index) => (
                  <span key={`${item}-${index}`}>{item}</span>
                ))}
              </p>
            </div>
          </div>
          <div className="utility-controls">
            <div className="theme-switch" aria-label={text.theme}>
              <button
                className={theme === "light" ? "active" : ""}
                type="button"
                title={text.light}
                onClick={() => handleThemeChange("light")}
              >
                <Sun size={15} />
                <span>{text.light}</span>
              </button>
              <button
                className={theme === "dark" ? "active" : ""}
                type="button"
                title={text.dark}
                onClick={() => handleThemeChange("dark")}
              >
                <Moon size={15} />
                <span>{text.dark}</span>
              </button>
            </div>
            <div className="language-switch" aria-label={text.language}>
              <Languages size={15} />
              {localeOptions.map((option) => (
                <button
                  className={locale === option ? "active" : ""}
                  key={option}
                  type="button"
                  onClick={() => handleLocaleChange(option)}
                >
                  {localeNames[option]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {isHome ? (
          <>
            <header className="topbar home-topbar">
              <div>
                <p className="eyebrow">{text.homeOverview}</p>
                <h2>{text.homeTitle}</h2>
              </div>
              <button className="primary-action compact" type="button" onClick={() => handleTaskChange(tasks[0].id)}>
                <ListChecks size={17} />
                {text.startFirstTask}
              </button>
            </header>

            <section className="home-hero">
              <div className="home-hero-copy">
                <p className="eyebrow">{text.capability}</p>
                <h2>{text.heroTitle}</h2>
                <p>{text.heroCopy}</p>
                <div className="hero-chips">
                  <span className="hero-chip live"><i />{text.rangeOnline}</span>
                  <span className="hero-chip">{text.seedDeterministic}</span>
                  <span className="hero-chip">{text.evalDriven}</span>
                  <span className="hero-chip">{text.bilingualReady}</span>
                </div>
              </div>
              <div className="home-scoreboard">
                <span>
                  <strong>{tasks.length}</strong>
                  {text.tasks}
                </span>
                <span>
                  <strong>{featureModulesText.length}</strong>
                  {text.coverageModules}
                </span>
                <span>
                  <strong>{difficultyCounts.easy}/{difficultyCounts.medium}/{difficultyCounts.hard}</strong>
                  {difficultyText.easy[locale]}·{difficultyText.medium[locale]}·{difficultyText.hard[locale]}
                </span>
                <span>
                  <strong>100%</strong>
                  {text.passCriteria}
                </span>
              </div>
            </section>

            <section className="home-feature-grid" aria-label={text.capability}>
              {featureModulesText.map((module, index) => {
                const Icon = appIcons[module.appId];
                return (
                  <article className="feature-card" key={module.appId}>
                    <div className="feature-card-top">
                      <div className="feature-icon">
                        <Icon size={22} />
                      </div>
                      <span className="feature-index">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h3>{module.title[locale]}</h3>
                    <p>{module.description[locale]}</p>
                    <div className="tag-row compact-tags">
                      {module.features[locale].map((feature) => (
                        <span key={feature}>{feature}</span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">{text.taskNumber}</p>
                  <h2>{text.assignmentBoard}</h2>
                </div>
                <ListChecks size={22} />
              </div>
              <div className="task-board">
                {numberedTasks.map(({ task, code }) => {
                  const Icon = appIcons[task.appId];
                  const taskCopy = localizedTask(task, locale);
                  return (
                    <button
                      className="assignment-row"
                      key={task.id}
                      type="button"
                      onClick={() => handleTaskChange(task.id)}
                    >
                      <span className="task-code">{code}</span>
                      <Icon size={18} />
                      <span>
                        <strong>{taskCopy.title}</strong>
                        <small>{taskCopy.appName} · {taskCopy.summary}</small>
                      </span>
                      <small className={`difficulty-pill ${task.difficulty}`}>{difficultyText[task.difficulty][locale]}</small>
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <>
        <header className="topbar">
          <div>
            <p className="eyebrow">{currentTaskCopy.appName}</p>
            <h2>
              {taskCode(tasks.findIndex((task) => task.id === taskId))} {currentTaskCopy.title}
            </h2>
          </div>
          <div className="button-row">
            <button className="secondary-action" type="button" onClick={() => resetTask()}>
              <RefreshCcw size={17} />
              {text.reset}
            </button>
            <button className="primary-action compact" type="button" onClick={evaluate}>
              <ClipboardCheck size={17} />
              {text.evaluate}
            </button>
            <button className="secondary-action icon-only" type="button" onClick={exportReport} title={text.exportReport}>
              <Download size={17} />
            </button>
          </div>
        </header>

        <section className="instruction-strip" aria-label={text.instruction}>
          <div>
            <p className="eyebrow">{text.instruction}</p>
            <p>{instruction}</p>
          </div>
          <div className="tag-row">
            {currentTaskCopy.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </section>

        {shouldShowResultBanner ? (
          <section className={displayedEvaluation.success ? "completion-banner success" : "completion-banner fail"}>
            {displayedEvaluation.success ? <CheckCircle2 size={30} /> : <XCircle size={30} />}
            <div>
              <strong>{displayedEvaluation.success ? text.taskPassed : text.taskFailed}</strong>
              <span>
                {text.currentScore} {Math.round(displayedEvaluation.score * 100)}%
                {displayedEvaluation.failureReason ? `, ${text.pending}: ${displayedEvaluation.failureReason}` : ""}
              </span>
            </div>
          </section>
        ) : null}

        {renderTask()}
          </>
        )}
      </section>

      <aside className="inspector" aria-label={isHome ? text.siteStatus : text.evaluator}>
        {isHome ? (
          <>
            <section className="panel result-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">{text.siteStatus}</p>
                  <h2>{text.online}</h2>
                </div>
                <CheckCircle2 className="result-icon success" size={25} />
              </div>
              <div className="metric-list">
                <span>
                  <CalendarDays size={17} />
                  {todayText}
                </span>
                <span>
                  <Users size={17} />
                  {text.cumulativeVisits} {visitCount}
                </span>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">{text.suggestedSplit}</p>
                  <h2>{text.threePersonPack}</h2>
                </div>
              </div>
              <div className="assignment-pack">
                {["easy", "medium", "hard"].map((difficulty) => (
                  <div key={difficulty}>
                    <strong>{difficultyText[difficulty as keyof typeof difficultyText][locale]}</strong>
                    <span>
                      {numberedTasks
                        .filter(({ task }) => task.difficulty === difficulty)
                        .slice(0, 3)
                        .map(({ code }) => code)
                        .join(" / ")}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">{text.publicEntry}</p>
                  <h2>{text.shareAddress}</h2>
                </div>
                <ExternalLink size={22} />
              </div>
              <input readOnly value={`${window.location.origin}${window.location.pathname}`} aria-label={text.shareAddress} />
            </section>
          </>
        ) : (
          <>
        <section className="panel result-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{text.evaluator}</p>
              <h2>
                {evaluation
                  ? `${Math.round(evaluation.score * 100)}%`
                  : liveEvaluation.success
                    ? text.complete
                    : text.notRun}
              </h2>
            </div>
            {evaluation || liveEvaluation.success ? (
              displayedEvaluation.success ? (
                <CheckCircle2 className="result-icon success" size={25} />
              ) : (
                <XCircle className="result-icon fail" size={25} />
              )
            ) : null}
          </div>

          <div className="check-list">
            {displayedEvaluation.checks.map((check) => (
              <div className={check.passed ? "check-row pass" : "check-row"} key={check.id}>
                {check.passed ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
                <span>{check.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel event-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{text.eventLog}</p>
              <h2>{events.length} {text.eventsUnit}</h2>
            </div>
          </div>
          <ol className="event-list">
            {events.slice(0, 14).map((event) => (
              <li key={event.id}>
                <span>{eventTypeText[event.type][locale]}</span>
                <p>{event.label}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{text.taskLink}</p>
              <h2>{text.shareTask}</h2>
            </div>
            <Link2 size={22} />
          </div>
          <input readOnly value={shareUrl} aria-label={text.shareTask} />
          <div className="hint-box compact">
            {text.shareHintBefore}
            <code> window.__recordReplayDemo.report()</code>
            {text.shareHintAfter}
          </div>
        </section>
          </>
        )}
      </aside>

      <div className="toast" role="status" aria-live="polite">
        {toast}
      </div>
    </main>
  );
}

export default App;
