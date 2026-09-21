import { Search, ShieldCheck, Ticket } from "lucide-react";
import { useState } from "react";
import type { Locale } from "../lib/localization";
import { cheapestMatchingTrain } from "../lib/tasks";
import type { EventRecord, TicketState } from "../lib/types";

interface TicketBookingProps {
  locale: Locale;
  seed: number;
  state: TicketState;
  onChange: (next: TicketState, label: string, type?: EventRecord["type"]) => void;
}

const classLabels: Record<TicketState["target"]["className"], Record<Locale, string>> = {
  Second: { zh: "二等座", en: "Second class" },
  First: { zh: "一等座", en: "First class" },
  Business: { zh: "商务座", en: "Business class" },
};

const ticketText = {
  zh: {
    app: "车票预订",
    searchTitle: "车次搜索",
    target: "目标",
    origin: "出发地",
    destination: "目的地",
    date: "日期",
    datePlaceholder: "YYYY-MM-DD",
    search: "搜索",
    searching: "搜索中...",
    departWindow: "出发时段",
    morning: "上午",
    afternoon: "下午",
    allDay: "全天",
    loading: "正在查询实时余票...",
    seats: "张余票",
    soldOut: "售罄",
    select: "选择",
    empty: "填写路线并点击搜索后，会显示可售车次。",
    checkout: "下单",
    reservation: "订单确认",
    reserved: "已预订",
    cheapest: "当前 seed 的最低价匹配车次：",
    none: "无",
    passenger: "乘客",
    captcha: "模拟验证码",
    answer: "答案",
    reserveTicket: "预订车票",
    safeNote: "验证码和支付均为确定性 mock，仅用于回放评测。",
    eventOrigin: "填写出发地",
    eventDestination: "填写目的地",
    eventDate: "选择出行日期",
    eventSearch: "搜索车次",
    eventFilter: "修改出发时段筛选",
    eventSelect: "选择车次",
    eventPassenger: "填写乘客",
    eventCaptcha: "填写模拟验证码",
    eventReserve: "预订车票",
  },
  en: {
    app: "Ticket Booking",
    searchTitle: "Train search",
    target: "Target",
    origin: "Origin",
    destination: "Destination",
    date: "Date",
    datePlaceholder: "YYYY-MM-DD",
    search: "Search",
    searching: "Searching...",
    departWindow: "Depart",
    morning: "Morning",
    afternoon: "Afternoon",
    allDay: "All day",
    loading: "Checking live seat availability...",
    seats: "seats left",
    soldOut: "Sold out",
    select: "Select",
    empty: "Enter a route and search to show available trains.",
    checkout: "Checkout",
    reservation: "Reservation",
    reserved: "Reserved",
    cheapest: "Cheapest matching train for this seed:",
    none: "None",
    passenger: "Passenger",
    captcha: "Mock captcha",
    answer: "Answer",
    reserveTicket: "Reserve ticket",
    safeNote: "Captcha and payment are deterministic mocks for replay testing only.",
    eventOrigin: "Entered origin",
    eventDestination: "Entered destination",
    eventDate: "Selected travel date",
    eventSearch: "Searched trains",
    eventFilter: "Changed departure filter",
    eventSelect: "Selected train",
    eventPassenger: "Entered passenger",
    eventCaptcha: "Entered mock captcha",
    eventReserve: "Reserved ticket",
  },
} as const;

export function TicketBookingView({ locale, seed, state, onChange }: TicketBookingProps) {
  const text = ticketText[locale];
  const [isSearching, setIsSearching] = useState(false);
  const expectedTrain = cheapestMatchingTrain(state);
  const canSearch =
    state.search.origin.trim().length > 0 &&
    state.search.destination.trim().length > 0 &&
    state.search.date.length > 0;
  const canReserve =
    state.searched &&
    Boolean(state.selectedTrainId) &&
    state.passenger.trim().length > 0 &&
    Number(state.captchaInput) === state.target.captchaAnswer;
  const visibleTrains = state.trains.filter((train) => {
    if (state.filter === "all") return true;
    const hour = Number(train.depart.slice(0, 2));
    return state.filter === "morning" ? hour < 12 : hour >= 12;
  });
  const captchaLeft = Math.max(1, state.target.captchaAnswer - 3);
  const captchaRight = state.target.captchaAnswer - captchaLeft;

  const updateSearch = (
    patch: Partial<TicketState["search"]>,
    label: string,
    type: EventRecord["type"] = "input",
  ) => {
    onChange(
      {
        ...state,
        search: { ...state.search, ...patch },
        searched: false,
        selectedTrainId: null,
        order: null,
      },
      label,
      type,
    );
  };

  const searchTrains = () => {
    setIsSearching(true);
    window.setTimeout(() => {
      setIsSearching(false);
      onChange({ ...state, searched: true, selectedTrainId: null, order: null }, text.eventSearch, "workflow");
    }, 650);
  };

  const reserve = () => {
    onChange(
      {
        ...state,
        order: state.selectedTrainId
          ? {
              reference: `RR-${seed}-${state.selectedTrainId}`,
              trainId: state.selectedTrainId,
              passenger: state.passenger,
              status: "reserved",
            }
          : null,
      },
      text.eventReserve,
      "workflow",
    );
  };

  return (
    <div className="workspace-grid">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{text.app}</p>
            <h2>{text.searchTitle}</h2>
          </div>
          <span className="status-pill">{text.target} {classLabels[state.target.className][locale]}</span>
        </div>

        <div className="form-grid three">
          <label>
            <span>{text.origin}</span>
            <input
              value={state.search.origin}
              onChange={(event) => updateSearch({ origin: event.target.value }, text.eventOrigin)}
              placeholder={state.target.origin}
            />
          </label>
          <label>
            <span>{text.destination}</span>
            <input
              value={state.search.destination}
              onChange={(event) => updateSearch({ destination: event.target.value }, text.eventDestination)}
              placeholder={state.target.destination}
            />
          </label>
          <label>
            <span>{text.date}</span>
            <input
              type="text"
              inputMode="numeric"
              value={state.search.date}
              onChange={(event) => updateSearch({ date: event.target.value }, text.eventDate, "selection")}
              placeholder={text.datePlaceholder}
            />
          </label>
        </div>

        <div className="toolbar">
          <button
            className="secondary-action"
            type="button"
            disabled={!canSearch || isSearching}
            onClick={searchTrains}
          >
            <Search size={17} />
            {isSearching ? text.searching : text.search}
          </button>
          <label className="inline-select">
            <span>{text.departWindow}</span>
            <select
              value={state.filter}
              onChange={(event) =>
                onChange(
                  { ...state, filter: event.target.value as TicketState["filter"] },
                  text.eventFilter,
                  "selection",
                )
              }
            >
              <option value="morning">{text.morning}</option>
              <option value="afternoon">{text.afternoon}</option>
              <option value="all">{text.allDay}</option>
            </select>
          </label>
        </div>

        {isSearching ? <div className="loading-line">{text.loading}</div> : null}

        {state.searched ? (
          <div className="ticket-list">
            {visibleTrains.map((train) => (
              <article
                className={state.selectedTrainId === train.id ? "ticket-option selected" : "ticket-option"}
                key={train.id}
              >
                <div>
                  <strong>{train.id}</strong>
                  <span>
                    {train.depart} → {train.arrive}
                  </span>
                </div>
                <div>
                  <span>{classLabels[train.className][locale]}</span>
                  <span>{train.seats} {text.seats}</span>
                </div>
                <strong>${train.price}</strong>
                <button
                  className="text-button"
                  type="button"
                  disabled={train.seats === 0}
                  onClick={() =>
                    onChange({ ...state, selectedTrainId: train.id, order: null }, `${text.eventSelect} ${train.id}`)
                  }
                >
                  {train.seats === 0 ? text.soldOut : text.select}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">{text.empty}</div>
        )}
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{text.checkout}</p>
            <h2>{text.reservation}</h2>
          </div>
          {state.order ? <span className="status-pill success">{text.reserved}</span> : null}
        </div>

        <div className="hint-box">
          {text.cheapest} <strong>{expectedTrain?.id ?? text.none}</strong>
        </div>

        <label>
          <span>{text.passenger}</span>
          <input
            value={state.passenger}
            onChange={(event) =>
              onChange({ ...state, passenger: event.target.value, order: null }, text.eventPassenger)
            }
            placeholder={state.target.passenger}
          />
        </label>

        <label>
          <span>{text.captcha}: {captchaLeft} + {captchaRight}</span>
          <input
            inputMode="numeric"
            value={state.captchaInput}
            onChange={(event) =>
              onChange({ ...state, captchaInput: event.target.value, order: null }, text.eventCaptcha)
            }
            placeholder={text.answer}
          />
        </label>

        <button
          className="primary-action"
          type="button"
          disabled={!canReserve}
          onClick={reserve}
        >
          <Ticket size={18} />
          {text.reserveTicket}
        </button>

        <div className="safe-note">
          <ShieldCheck size={18} />
          {text.safeNote}
        </div>
      </section>
    </div>
  );
}
