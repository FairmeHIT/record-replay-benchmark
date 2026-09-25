import { Check, ChevronDown, Download, MousePointerClick, Sliders } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Locale } from "../lib/localization";
import type { ControlBenchmarkState, EventRecord } from "../lib/types";

interface ViewProps {
  taskId: string;
  locale: Locale;
  state: ControlBenchmarkState;
  onChange: (next: ControlBenchmarkState, label: string, type?: EventRecord["type"]) => void;
}

const cbText = {
  zh: {
    app: "控件验证场",
    atomic: "功能层：原子控件",
    atomicDesc: "逐控件验证识别、操作、状态校验。",
    scenarios: "场景层：复合技术场景",
    scenariosDesc: "每个场景有明确任务和成功条件。",
    button: "Button / Click",
    text: "文本 / 密码 / Textarea",
    choice: "Radio / Checkbox / Switch",
    select: "Select / Autocomplete",
    selectNative: "Native Select",
    autocomplete: "Autocomplete",
    date: "Date / Time",
    tabs: "Tabs / Accordion",
    tabsOnly: "Tabs",
    accordionOnly: "Accordion",
    modal: "Modal / Toast",
    tree: "Tree / Slider",
    drag: "Drag & Drop",
    canvas: "Canvas",
    svg: "SVG",
    shadow: "Shadow DOM",
    scroll: "Infinite Scroll",
    table: "Table / Sort",
    pagination: "Pagination",
    btnNormal: "普通按钮",
    btnDelayed: "延迟响应",
    btnDouble: "双击我",
    btnDisabled: "禁用按钮",
    textPlaceholder: "普通文本",
    pwdPlaceholder: "密码 123456",
    textareaPlaceholder: "多行文本",
    radioA: "A",
    radioB: "B",
    checkboxLabel: "同意",
    selectPlaceholder: "请选择",
    autoPlaceholder: "输入北/上/深/杭",
    autoHint: "需精确选择目标城市，不要误选相似项",
    accordionToggle: "展开高级信息",
    openModal: "打开弹窗",
    showToast: "显示 Toast",
    treeRoot: "▶ 华东区",
    dragSource: "拖动卡片 A",
    dropTarget: "拖到这里",
    canvasHint: "请点击蓝色圆形区域",
    svgHint: "等待 SVG 点击",
    shadowHint: "输入 SHADOW-123 后提交",
    scrollTarget: "目标：找到",
    sortScore: "按分数排序",
    pagePrev: "上一页",
    pageNext: "下一页",
    pageHint: "目标对象位于第 4 页",
    status: "等待动作",
    ok: "成功",
    bad: "失败",
    modalConfirm: "确认",
    modalCancel: "取消",
    s01Title: "S01 复合表单查询",
    s01Criteria: "客户名称、类型、日期匹配后结果必须为 FORM_SCENE_OK",
    s01Name: "客户名称",
    s01Type: "类型",
    s01Date: "日期",
    s01Search: "查询",
    s03Title: "S03 异步列表与筛选",
    s03Criteria: "筛选目标区域，等待异步加载后读取数据",
    s03Load: "加载数据",
    s04Title: "S04 分页查找",
    s04Criteria: "翻页找到目标订单后停止",
    s04Next: "下一页",
    s11Title: "S11 高风险提交防重",
    s11Criteria: "模拟付款一次，重复点击不得产生第二个流水号",
    s11Pay: "模拟付款",
    s11Confirm: "确认一次",
    s11Cancel: "取消",
    s12Title: "S12 DOM 不稳定 / 图形回退",
    s12Criteria: "依次完成 Shadow DOM 输入、Canvas 圆点击、SVG 圆点击",
    s12Check: "检查完成状态",
    eventId: "控件标识",
    eventBtnNormal: "点击普通按钮",
    eventBtnDelayed: "点击延迟按钮",
    eventBtnDouble: "双击按钮",
    eventText: "输入文本",
    eventChoice: "选择控件",
    eventSelect: "下拉选择",
    eventAuto: "自动补全选择",
    eventDate: "设置日期",
    eventTab: "切换 Tab",
    eventAccordion: "展开手风琴",
    eventModal: "确认弹窗",
    eventToast: "显示 Toast",
    eventTree: "展开树",
    eventSlider: "调整滑块",
    eventDrag: "拖拽放置",
    eventCanvas: "Canvas 点击",
    eventSvg: "SVG 点击",
    eventShadow: "Shadow 提交",
    eventScroll: "滚动查找",
    eventTableSort: "表格排序",
    eventPage: "翻页",
    eventS1: "复合表单查询",
    eventS3: "异步列表加载",
    eventS4: "分页查找",
    eventS11: "模拟付款",
    eventS12: "混合 UI 检查",
    eventName: "名称",
    eventAmount: "金额",
    eventInput: "输入",
  },
  en: {
    app: "Control Benchmark",
    atomic: "Functional Layer: Atomic Controls",
    atomicDesc: "Verify identification, interaction, and state for each control.",
    scenarios: "Scenario Layer: Composite Tasks",
    scenariosDesc: "Each scenario has a clear task and success condition.",
    button: "Button / Click",
    text: "Text / Password / Textarea",
    choice: "Radio / Checkbox / Switch",
    select: "Select / Autocomplete",
    selectNative: "Native Select",
    autocomplete: "Autocomplete",
    date: "Date / Time",
    tabs: "Tabs / Accordion",
    tabsOnly: "Tabs",
    accordionOnly: "Accordion",
    modal: "Modal / Toast",
    tree: "Tree / Slider",
    drag: "Drag & Drop",
    canvas: "Canvas",
    svg: "SVG",
    shadow: "Shadow DOM",
    scroll: "Infinite Scroll",
    table: "Table / Sort",
    pagination: "Pagination",
    btnNormal: "Normal",
    btnDelayed: "Delayed",
    btnDouble: "Double-click",
    btnDisabled: "Disabled",
    textPlaceholder: "Plain text",
    pwdPlaceholder: "Password 123456",
    textareaPlaceholder: "Multi-line text",
    radioA: "A",
    radioB: "B",
    checkboxLabel: "Agree",
    selectPlaceholder: "Select",
    autoPlaceholder: "Type 北/上/深/杭",
    autoHint: "Select exact target city, avoid similar candidates",
    accordionToggle: "Expand details",
    openModal: "Open Modal",
    showToast: "Show Toast",
    treeRoot: "▶ East China",
    dragSource: "Drag card A",
    dropTarget: "Drop here",
    canvasHint: "Click the blue circle",
    svgHint: "Waiting for SVG click",
    shadowHint: "Enter SHADOW-123 and submit",
    scrollTarget: "Target: find",
    sortScore: "Sort by score",
    pagePrev: "Prev",
    pageNext: "Next",
    pageHint: "Target is on page 4",
    status: "Waiting",
    ok: "OK",
    bad: "Fail",
    modalConfirm: "Confirm",
    modalCancel: "Cancel",
    s01Title: "S01 Composite Form Query",
    s01Criteria: "Name, type, and date must match; result must be FORM_SCENE_OK",
    s01Name: "Customer name",
    s01Type: "Type",
    s01Date: "Date",
    s01Search: "Search",
    s03Title: "S03 Async List & Filter",
    s03Criteria: "Filter target region, wait for async load, read data",
    s03Load: "Load data",
    s04Title: "S04 Paginated Search",
    s04Criteria: "Page through to find target order, then stop",
    s04Next: "Next page",
    s11Title: "S11 Idempotent Payment",
    s11Criteria: "Submit payment once; duplicate clicks must not create a second transaction",
    s11Pay: "Pay",
    s11Confirm: "Confirm once",
    s11Cancel: "Cancel",
    s12Title: "S12 Mixed UI Recovery",
    s12Criteria: "Complete Shadow DOM input, Canvas circle click, and SVG circle click",
    s12Check: "Check completion",
    eventId: "Test ID",
    eventBtnNormal: "Clicked normal button",
    eventBtnDelayed: "Clicked delayed button",
    eventBtnDouble: "Double-clicked button",
    eventText: "Entered text",
    eventChoice: "Selected choice controls",
    eventSelect: "Selected from dropdown",
    eventAuto: "Autocomplete selection",
    eventDate: "Set date",
    eventTab: "Switched tab",
    eventAccordion: "Toggled accordion",
    eventModal: "Confirmed modal",
    eventToast: "Showed toast",
    eventTree: "Expanded tree",
    eventSlider: "Adjusted slider",
    eventDrag: "Drag and drop",
    eventCanvas: "Canvas click",
    eventSvg: "SVG click",
    eventShadow: "Shadow DOM submit",
    eventScroll: "Scroll find",
    eventTableSort: "Table sort",
    eventPage: "Page navigation",
    eventS1: "Composite form query",
    eventS3: "Async list load",
    eventS4: "Paginated search",
    eventS11: "Payment",
    eventS12: "Mixed UI check",
    eventName: "Name",
    eventAmount: "Amount",
    eventInput: "Input",
  },
} as const;

const cities = ["北京", "北京东", "北京南", "上海", "上海虹桥", "深圳", "杭州", "南京", "广州"];
const allCities = ["北京", "上海", "深圳", "杭州", "南京"];

function autocompleteCandidates(flip: boolean): string[] {
  return flip ? ["北京南", "北京东", "北京", "北京北"] : ["北京东", "北京", "北京南", "北京北"];
}

const initialRows: Array<[string, string, number, string]> = [
  ["R-01", "Alpha", 72, "普通"],
  ["R-02", "Beta", 91, "重点"],
  ["R-03", "Gamma", 84, "普通"],
];

function ShadowHost({ value, onChange, locale }: { value: string; onChange: (v: string, result: string) => void; locale: Locale }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const text = cbText[locale];
  valueRef.current = value;
  onChangeRef.current = onChange;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.shadowRoot) return;
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .sd { border: 1px solid #dfe5ee; border-radius: 10px; padding: 12px; }
        input, button { padding: 8px; border-radius: 7px; margin: 3px; font: inherit; }
        button { background: #2563eb; color: white; border: 0; cursor: pointer; }
        .res { margin-left: 6px; font-weight: 700; }
        .ok { color: #138a52; }
        .bad { color: #c73b3b; }
      </style>
      <div class="sd">
        <input id="sInput" placeholder="${text.shadowHint}" />
        <button id="sBtn">Submit</button>
        <span class="res" id="sRes"></span>
      </div>
    `;
    const input = shadow.getElementById("sInput") as HTMLInputElement;
    const btn = shadow.getElementById("sBtn") as HTMLButtonElement;
    const res = shadow.getElementById("sRes") as HTMLSpanElement;
    input.value = valueRef.current;
    btn.onclick = () => {
      const nextValue = input.value;
      const ok = nextValue === "SHADOW-123";
      res.textContent = ok ? "SHADOW_OK" : "SHADOW_BAD";
      res.className = ok ? "res ok" : "res bad";
      onChangeRef.current(nextValue, ok ? "SHADOW_OK" : "SHADOW_BAD");
    };
  }, [text.shadowHint]);

  useEffect(() => {
    const input = hostRef.current?.shadowRoot?.getElementById("sInput") as HTMLInputElement | null;
    if (input && input.value !== value) input.value = value;
  }, [value]);

  return <div ref={hostRef} data-testid="shadow-host" />;
}

export function ControlBenchmarkView({ taskId, locale, state, onChange }: ViewProps) {
  const text = cbText[locale];
  const showBasic = taskId === "control-benchmark.atomic-basic";
  const showAdvanced = taskId === "control-benchmark.atomic-advanced";
  const showComposite = taskId === "control-benchmark.composite-scenarios";
  const showAtomic = showBasic || showAdvanced || showComposite;
  const f = state.form;
  const t = state.target;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 420, 160);
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(120, 80, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111827";
    ctx.font = "14px sans-serif";
    ctx.fillText(text.canvasHint, 180, 86);
  }, [taskId, text.canvasHint]);

  const patch = (p: Partial<ControlBenchmarkState["form"]>, label: string, type: EventRecord["type"] = "input") => {
    onChange({ ...state, form: { ...f, ...p } }, label, type);
  };

  const checkChoiceDone = (p: Partial<ControlBenchmarkState["form"]>) => {
    const merged = { ...f, ...p };
    const done = merged.radioValue === t.radioValue && merged.checkboxChecked && merged.switchOn === t.switchOn;
    return done;
  };

  const autocompleteSuggestions = autocompleteCandidates(t.candidateFlip).filter((c) =>
    f.autocompleteValue || c.includes(f.autocompleteValue),
  );

  const sortedRows = f.tableSorted
    ? [...initialRows].sort((a, b) => b[2] - a[2])
    : initialRows;

  const paginationItems = (() => {
    const items: string[] = [];
    for (let i = 1; i <= 5; i++) {
      items.push(f.paginationPage === 4 && i === 3 ? "TARGET-P4-03" : `P${f.paginationPage}-ITEM-${i}`);
    }
    return items;
  })();

  return (
    <div className="workspace-grid">
      {showAtomic ? (
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{text.app}</p>
            <h2>{text.atomic}</h2>
          </div>
          <Sliders size={20} />
        </div>
        <p className="safe-note">{text.atomicDesc}</p>

        <div className="cb-grid">
          {showBasic ? (
            <>
{/* 1. Button */}
          <div className="cb-card">
            <h3>{text.button}</h3>
            <div className="cb-row">
              <button
                className="primary-action compact"
                data-testid="button-normal"
                onClick={() => patch({ buttonNormalOk: true }, text.eventBtnNormal, "workflow")}
              >
                {text.btnNormal}
              </button>
              <button
                className="secondary-action compact"
                data-testid="button-delayed"
                onClick={() => patch({ buttonDelayedOk: true }, text.eventBtnDelayed, "workflow")}
              >
                {text.btnDelayed}
              </button>
              <button
                className="primary-action compact"
                data-testid="button-double"
                onDoubleClick={() => patch({ buttonDoubleOk: true }, text.eventBtnDouble, "workflow")}
              >
                {text.btnDouble}
              </button>
              <button className="primary-action compact" disabled>
                {text.btnDisabled}
              </button>
            </div>
            <div className={`status-text ${f.buttonNormalOk && f.buttonDelayedOk && f.buttonDoubleOk ? "approved" : "pending"}`}>
              {f.buttonNormalOk ? "BUTTON_NORMAL_OK" : text.status}
              {f.buttonDelayedOk ? " · BUTTON_DELAY_OK" : ""}
              {f.buttonDoubleOk ? " · DOUBLE_CLICK_OK" : ""}
            </div>
          </div>

                      </>
          ) : null}
          {showBasic ? (
            <>
{/* 2. Text */}
          <div className="cb-card">
            <h3>{text.text}</h3>
            <div className="cb-col">
              <input
                value={f.textValue}
                data-testid="input-text"
                placeholder={t.textValue}
                onChange={(e) => patch({ textValue: e.target.value, textChanged: true }, text.eventText)}
              />
              <input
                type="password"
                value={f.passwordValue}
                data-testid="input-password"
                placeholder={t.passwordValue}
                onChange={(e) => patch({ passwordValue: e.target.value }, text.eventText)}
              />
              <textarea
                value={f.textareaValue}
                data-testid="input-textarea"
                placeholder={text.textareaPlaceholder}
                onChange={(e) => patch({ textareaValue: e.target.value }, text.eventText)}
              />
            </div>
            <div className={`status-text ${f.textChanged ? "approved" : "pending"}`}>
              {f.textChanged ? "TEXT_CHANGED" : text.status}
            </div>
          </div>

                      </>
          ) : null}
          {showBasic ? (
            <>
{/* 3. Radio / Checkbox / Switch */}
          <div className="cb-card">
            <h3>{text.choice}</h3>
            <div className="cb-row">
              <label className="checkbox-line">
                <input
                  type="radio"
                  name="cb-level"
                  data-testid="radio-a"
                  checked={f.radioValue === "A"}
                  onChange={() => patch({ radioValue: "A", choiceDone: checkChoiceDone({ radioValue: "A" }) }, text.eventChoice, "selection")}
                />
                {text.radioA}
              </label>
              <label className="checkbox-line">
                <input
                  type="radio"
                  name="cb-level"
                  data-testid="radio-b"
                  checked={f.radioValue === "B"}
                  onChange={() => patch({ radioValue: "B", choiceDone: checkChoiceDone({ radioValue: "B" }) }, text.eventChoice, "selection")}
                />
                {text.radioB}
              </label>
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  data-testid="checkbox-a"
                  checked={f.checkboxChecked}
                  onChange={(e) => patch({ checkboxChecked: e.target.checked, choiceDone: checkChoiceDone({ checkboxChecked: e.target.checked }) }, text.eventChoice, "selection")}
                />
                {text.checkboxLabel}
              </label>
              <label className="switch-label">
                <input
                  type="checkbox"
                  data-testid="switch-a"
                  checked={f.switchOn}
                  onChange={(e) => patch({ switchOn: e.target.checked, choiceDone: checkChoiceDone({ switchOn: e.target.checked }) }, text.eventChoice, "selection")}
                />
                <span className="switch-track" />
              </label>
            </div>
            <div className={`status-text ${f.choiceDone ? "approved" : "pending"}`}>
              radio={f.radioValue || "-"} checkbox={f.checkboxChecked} switch={f.switchOn}
            </div>
          </div>

                      </>
          ) : null}
          {showBasic || showAdvanced ? (
            <>
{/* 4. Select */}
          <div className="cb-card">
            <h3>{showBasic ? text.selectNative : text.autocomplete}</h3>
            <div className="cb-col">
              {showBasic ? (
                <select
                  value={f.selectValue}
                  data-testid="select-native"
                  onChange={(e) => patch({ selectValue: e.target.value }, text.eventSelect, "selection")}
                >
                  <option value="">{text.selectPlaceholder}</option>
                  {allCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              ) : null}
              {showAdvanced ? (
                <div className="autocomplete">
                  <input
                    value={f.autocompleteValue}
                    data-testid="autocomplete-input"
                    placeholder={text.autoPlaceholder}
                    onChange={(e) => patch({ autocompleteValue: e.target.value }, text.eventAuto)}
                  />
                  <div className="suggestions show" data-testid="autocomplete-panel">
                    {autocompleteSuggestions.map((c) => (
                      <div
                        key={c}
                        data-value={c}
                        onClick={() => patch({ autocompleteValue: c, autocompleteDone: true }, text.eventAuto, "selection")}
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            {showAdvanced ? <div className="safe-note">{text.autoHint}</div> : null}
          </div>

                      </>
          ) : null}
          {showAdvanced ? (
            <>
{/* 5. Date / Time */}
          <div className="cb-card">
            <h3>{text.date}</h3>
            <div className="cb-row">
              <input
                type="date"
                value={f.dateValue}
                data-testid="input-date"
                onChange={(e) => patch({ dateValue: e.target.value, dateDone: true }, text.eventDate)}
              />
              <input
                type="time"
                value={f.timeValue}
                data-testid="input-time"
                onChange={(e) => patch({ timeValue: e.target.value, dateDone: true }, text.eventDate)}
              />
            </div>
            <div className={`status-text ${f.dateDone ? "approved" : "pending"}`}>
              date={f.dateValue || "-"} time={f.timeValue || "-"}
            </div>
          </div>

                      </>
          ) : null}
          {showBasic || showAdvanced ? (
            <>
{/* 6. Tabs / Accordion */}
          <div className="cb-card">
            <h3>{showBasic ? text.tabsOnly : text.accordionOnly}</h3>
            {showBasic ? (
              <>
                <div className="cb-tabs">
                  {["tab1", "tab2", "tab3"].map((tab) => (
                    <button
                      key={tab}
                      className={f.tabActive === tab ? "cb-tab active" : "cb-tab"}
                      data-testid={`tab-${tab.slice(-1)}`}
                      onClick={() => patch({ tabActive: tab }, text.eventTab, "selection")}
                    >
                      {tab === "tab1" ? (locale === "zh" ? "概览" : "Overview") : tab === "tab2" ? (locale === "zh" ? "详情" : "Details") : (locale === "zh" ? "设置" : "Settings")}
                    </button>
                  ))}
                </div>
                <div className="cb-tab-panel">
                  {f.tabActive === "tab1" ? "A-001" : f.tabActive === "tab2" ? "B-002" : "C-003"}
                </div>
              </>
            ) : null}
            {showAdvanced ? (
              <>
                <button
                  className="text-button"
                  data-testid="accordion-toggle"
                  onClick={() => patch({ accordionOpen: !f.accordionOpen }, text.eventAccordion)}
                >
                  <ChevronDown size={15} className={f.accordionOpen ? "rotated" : ""} />
                  {text.accordionToggle}
                </button>
                {f.accordionOpen ? <div className="safe-note">ACC-OK</div> : null}
              </>
            ) : null}
          </div>

                      </>
          ) : null}
          {showBasic ? (
            <>
{/* 7. Modal / Toast */}
          <div className="cb-card">
            <h3>{text.modal}</h3>
            <div className="cb-row">
              <button
                className="primary-action compact"
                data-testid="modal-open"
                onClick={() => patch({ modalOpen: true }, text.eventModal, "workflow")}
              >
                {text.openModal}
              </button>
              <button
                className="secondary-action compact"
                data-testid="toast-show"
                onClick={() => patch({ toastShown: true }, text.eventToast, "workflow")}
              >
                {text.showToast}
              </button>
            </div>
            {f.modalOpen ? (
              <div className="modal-backdrop" role="presentation" onClick={() => patch({ modalOpen: false }, text.eventModal)}>
                <div className="modal" role="dialog" onClick={(e) => e.stopPropagation()}>
                  <h3>{text.modal}</h3>
                  <p>MODAL_OK</p>
                  <div className="modal-actions">
                    <button className="secondary-action compact" onClick={() => patch({ modalOpen: false }, text.eventModal)}>
                      {text.modalCancel}
                    </button>
                    <button
                      className="primary-action compact"
                      data-testid="modal-confirm"
                      onClick={() => patch({ modalOpen: false, modalConfirmed: true }, text.eventModal, "workflow")}
                    >
                      <Check size={15} />
                      {text.modalConfirm}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            <div className={`status-text ${f.modalConfirmed ? "approved" : "pending"}`}>
              {f.modalConfirmed ? "MODAL_OK" : text.status}
              {f.toastShown ? " · TOAST_OK" : ""}
            </div>
          </div>

                      </>
          ) : null}
          {showBasic ? (
            <>
{/* 8. Tree / Slider */}
          <div className="cb-card">
            <h3>{text.tree}</h3>
            <div className="cb-tree">
              <span
                className="cb-tree-node"
                data-testid="tree-root"
                onClick={() => patch({ treeOpen: !f.treeOpen }, text.eventTree, "selection")}
              >
                {text.treeRoot}
              </span>
              {f.treeOpen ? (
                <ul className="cb-tree-children">
                  <li data-testid="tree-shanghai">{locale === "zh" ? "上海" : "Shanghai"}</li>
                  <li data-testid="tree-jiangsu">{locale === "zh" ? "江苏" : "Jiangsu"}</li>
                </ul>
              ) : null}
            </div>
            <div className="cb-row">
              <input
                type="range"
                min="0"
                max="100"
                value={f.sliderValue}
                data-testid="slider"
                onChange={(e) => patch({ sliderValue: Number(e.target.value), sliderDone: true }, text.eventSlider)}
              />
              <span>{f.sliderValue}</span>
            </div>
          </div>

                      </>
          ) : null}
          {showAdvanced ? (
            <>
{/* 9. Drag & Drop */}
          <div className="cb-card">
            <h3>{text.drag}</h3>
            <div className="cb-row">
              <div
                className="cb-draggable"
                draggable
                data-testid="drag-source"
                onDragStart={(e) => e.dataTransfer.setData("text/plain", "DRAG_A")}
              >
                {text.dragSource}
              </div>
            </div>
            <div
              className="cb-dropzone"
              data-testid="drop-target"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const ok = e.dataTransfer.getData("text/plain") === "DRAG_A";
                patch({ dragCompleted: ok }, text.eventDrag, "workflow");
              }}
            >
              {f.dragCompleted ? "DRAG_DROP_OK" : text.dropTarget}
            </div>
          </div>

                      </>
          ) : null}
          {showAdvanced || showComposite ? (
            <>
{/* 10. Canvas */}
          <div className="cb-card">
            <h3>{text.canvas}</h3>
            <canvas
              ref={canvasRef}
              width={420}
              height={160}
              data-testid="canvas"
              className="cb-canvas"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) * (420 / rect.width);
                const y = (e.clientY - rect.top) * (160 / rect.height);
                const hit = (x - 120) ** 2 + (y - 80) ** 2 <= 42 ** 2;
                patch({ canvasClicked: hit }, text.eventCanvas, "workflow");
              }}
            />
            <div className={`status-text ${f.canvasClicked ? "approved" : "pending"}`}>
              {f.canvasClicked ? "CANVAS_OK" : text.canvasHint}
            </div>
          </div>

                      </>
          ) : null}
          {showAdvanced || showComposite ? (
            <>
{/* 11. SVG */}
          <div className="cb-card">
            <h3>{text.svg}</h3>
            <svg className="cb-svg" viewBox="0 0 500 190" data-testid="svg-root">
              <rect x="25" y="25" width="150" height="70" rx="10" fill="#dbeafe" stroke="#2563eb" data-testid="svg-rect" />
              <text x="100" y="67" textAnchor="middle" pointerEvents="none">A</text>
              <circle
                cx="320"
                cy="62"
                r="38"
                fill="#dcfce7"
                stroke="#16a34a"
                data-testid="svg-circle"
                onClick={() => patch({ svgClicked: true }, text.eventSvg, "workflow")}
              />
              <text x="320" y="67" textAnchor="middle" pointerEvents="none">B</text>
            </svg>
            <div className={`status-text ${f.svgClicked ? "approved" : "pending"}`}>
              {f.svgClicked ? "SVG_CIRCLE_OK" : text.svgHint}
            </div>
          </div>

                      </>
          ) : null}
          {showAdvanced || showComposite ? (
            <>
{/* 12. Shadow DOM */}
          <div className="cb-card">
            <h3>{text.shadow}</h3>
            <ShadowHost
              value={f.shadowValue}
              locale={locale}
              onChange={(v, r) => patch({ shadowValue: v, shadowResult: r }, text.eventShadow, "workflow")}
            />
            <div className={`status-text ${f.shadowResult === "SHADOW_OK" ? "approved" : "pending"}`}>
              {f.shadowResult || text.status}
            </div>
          </div>

                      </>
          ) : null}
          {showAdvanced ? (
            <>
{/* 13. Infinite Scroll */}
          <div className="cb-card">
            <h3>{text.scroll}</h3>
            <div className="cb-scrollbox" data-testid="infinite-scroll">
              {Array.from({ length: 100 }, (_, i) => `ITEM-${String(i + 1).padStart(3, "0")}`).map((item) => (
                <div
                  key={item}
                  className="cb-scroll-item"
                  data-testid={`scroll-${item}`}
                  onClick={() => {
                    if (item === t.scrollTarget) {
                      patch({ scrollTargetFound: true }, text.eventScroll, "workflow");
                    }
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className={`status-text ${f.scrollTargetFound ? "approved" : "pending"}`}>
              {text.scrollTarget} {t.scrollTarget}
            </div>
          </div>

                      </>
          ) : null}
          {showAdvanced ? (
            <>
{/* 14. Table / Sort */}
          <div className="cb-card">
            <h3>{text.table}</h3>
            <button
              className="text-button"
              data-testid="table-sort"
              onClick={() => patch({ tableSorted: !f.tableSorted }, text.eventTableSort, "workflow")}
            >
              {text.sortScore}
            </button>
            <div className="data-table">
              <div className="data-row header">
                <span>ID</span>
                <span>{locale === "zh" ? "名称" : "Name"}</span>
                <span>{locale === "zh" ? "分数" : "Score"}</span>
              </div>
              {sortedRows.map((row) => (
                <div className="data-row" key={row[0]}>
                  <span>{row[0]}</span>
                  <span>{row[1]}</span>
                  <span>{row[2]}</span>
                </div>
              ))}
            </div>
          </div>

                      </>
          ) : null}
          {showAdvanced ? (
            <>
{/* 15. Pagination */}
          <div className="cb-card">
            <h3>{text.pagination}</h3>
            <div className="data-table">
              {paginationItems.map((item) => (
                <div className="data-row" key={item}>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="cb-row">
              <button
                className="text-button"
                data-testid="page-prev"
                onClick={() => patch({ paginationPage: Math.max(1, f.paginationPage - 1) }, text.eventPage, "selection")}
              >
                {text.pagePrev}
              </button>
              <span>{f.paginationPage} / 5</span>
              <button
                className="text-button"
                data-testid="page-next"
                onClick={() => {
                  const next = Math.min(5, f.paginationPage + 1);
                  const found = next === 4;
                  patch({ paginationPage: next, paginationTargetFound: found || f.paginationTargetFound }, text.eventPage, "selection");
                }}
              >
                {text.pageNext}
              </button>
            </div>
            <div className={`status-text ${f.paginationTargetFound ? "approved" : "pending"}`}>
              {text.pageHint}: {t.paginationTarget}
            </div>
          </div>            </>
          ) : null}

        </div>
      </section>
      ) : null}

      {showComposite ? (
      <>
      {/* Scenarios */}
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{text.app}</p>
            <h2>{text.scenarios}</h2>
          </div>
          <MousePointerClick size={20} />
        </div>
        <p className="safe-note">{text.scenariosDesc}</p>

        <div className="cb-grid">
          {/* S01 */}
          <div className="cb-card">
            <h3>{text.s01Title}</h3>
            <div className="safe-note">{text.s01Criteria}</div>
            <div className="cb-col">
              <input
                value={f.s1Name}
                data-testid="s1-name"
                placeholder={t.scenarioName}
                onChange={(e) => patch({ s1Name: e.target.value }, text.eventS1)}
              />
              <select
                value={f.s1Type}
                data-testid="s1-type"
                onChange={(e) => patch({ s1Type: e.target.value }, text.eventS1, "selection")}
              >
                <option value="个人">{locale === "zh" ? "个人" : "Personal"}</option>
                <option value="企业">{locale === "zh" ? "企业" : "Enterprise"}</option>
              </select>
              <input
                type="date"
                value={f.s1Date}
                data-testid="s1-date"
                onChange={(e) => patch({ s1Date: e.target.value }, text.eventS1)}
              />
              <button
                className="primary-action compact"
                data-testid="s1-search"
                onClick={() => {
                  const ok = f.s1Name === t.scenarioName && f.s1Type === t.scenarioType && f.s1Date === t.scenarioDate;
                  patch({ s1Result: ok ? "FORM_SCENE_OK" : "MISMATCH" }, text.eventS1, "workflow");
                }}
              >
                {text.s01Search}
              </button>
            </div>
            <div className={`status-text ${f.s1Result === "FORM_SCENE_OK" ? "approved" : "pending"}`}>
              {f.s1Result || text.status}
            </div>
          </div>

          {/* S03 */}
          <div className="cb-card">
            <h3>{text.s03Title}</h3>
            <div className="safe-note">{text.s03Criteria}</div>
            <div className="cb-row">
              <select
                value={f.s3Region}
                data-testid="s3-region"
                onChange={(e) => patch({ s3Region: e.target.value }, text.eventS3, "selection")}
              >
                <option value="全部">{locale === "zh" ? "全部" : "All"}</option>
                <option value="华东">华东</option>
                <option value="华南">华南</option>
              </select>
              <button
                className="primary-action compact"
                data-testid="s3-load"
                onClick={() => {
                  const ok = f.s3Region === t.scenarioRegion;
                  patch({ s3Loaded: true, s3Result: ok ? "ASYNC_TABLE_OK" : "DATA_LOADED" }, text.eventS3, "workflow");
                }}
              >
                {text.s03Load}
              </button>
            </div>
            {f.s3Loaded ? (
              <div className="data-table">
                <div className="data-row header">
                  <span>ID</span>
                  <span>{locale === "zh" ? "区域" : "Region"}</span>
                  <span>{locale === "zh" ? "金额" : "Amount"}</span>
                </div>
                <div className="data-row"><span>C-007</span><span>华南</span><span>8800</span></div>
              </div>
            ) : null}
            <div className={`status-text ${f.s3Result === "ASYNC_TABLE_OK" ? "approved" : "pending"}`}>
              {f.s3Result || text.status}
            </div>
          </div>

          {/* S04 */}
          <div className="cb-card">
            <h3>{text.s04Title}</h3>
            <div className="safe-note">{text.s04Criteria}</div>
            <div className="data-table">
              {Array.from({ length: 5 }, (_, i) => {
                const item = f.s4Page === 5 && i === 1 ? "ORDER-X-042" : `ORDER-${f.s4Page}-${String(i + 1).padStart(3, "0")}`;
                return <div className="data-row" key={i}><span>{item}</span></div>;
              })}
            </div>
            <div className="cb-row">
              <span>{locale === "zh" ? "第" : "Page"} {f.s4Page} {locale === "zh" ? "页" : ""}</span>
              <button
                className="primary-action compact"
                data-testid="s4-next"
                onClick={() => {
                  const next = Math.min(8, f.s4Page + 1);
                  const found = next === 5;
                  patch({ s4Page: next, s4Result: found ? "FOUND ORDER-X-042" : f.s4Result }, text.eventS4, "workflow");
                }}
              >
                {text.s04Next}
              </button>
            </div>
            <div className={`status-text ${f.s4Result.includes("ORDER-X-042") ? "approved" : "pending"}`}>
              {f.s4Result || text.status}
            </div>
          </div>

          {/* S11 */}
          <div className="cb-card">
            <h3>{text.s11Title}</h3>
            <div className="safe-note">{text.s11Criteria}</div>
            <div className="cb-row">
              <input
                type="number"
                value={f.s11Amount}
                data-testid="s11-amount"
                onChange={(e) => patch({ s11Amount: Number(e.target.value) }, text.eventS11)}
              />
              <button
                className="primary-action compact danger"
                data-testid="s11-pay"
                onClick={() => patch({ s11ModalOpen: true }, text.eventS11, "workflow")}
                style={{ background: "#c73b3b" }}
              >
                {text.s11Pay}
              </button>
            </div>
            {f.s11ModalOpen ? (
              <div className="modal-backdrop" role="presentation" onClick={() => patch({ s11ModalOpen: false }, text.eventS11)}>
                <div className="modal" role="dialog" onClick={(e) => e.stopPropagation()}>
                  <h3>{text.s11Confirm}</h3>
                  <div className="modal-actions">
                    <button className="secondary-action compact" onClick={() => patch({ s11ModalOpen: false }, text.eventS11)}>
                      {text.s11Cancel}
                    </button>
                    <button
                      className="primary-action compact"
                      data-testid="risk-confirm"
                      style={{ background: "#c73b3b" }}
                      onClick={() => {
                        if (f.s11Paid) {
                          patch({ s11ModalOpen: false, s11DuplicateBlocked: true }, text.eventS11, "workflow");
                          return;
                        }
                        if (f.s11Amount !== t.scenarioAmount) {
                          patch({ s11ModalOpen: false, s11Result: "PAYMENT_REJECTED_AMOUNT" }, text.eventS11, "workflow");
                          return;
                        }
                        const no = `PAY-${Date.now()}`;
                        patch({ s11ModalOpen: false, s11Paid: true, s11TransactionId: no, s11Result: `PAYMENT_MOCK_OK ${no}` }, text.eventS11, "workflow");
                      }}
                    >
                      {text.s11Confirm}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            <div className={`status-text ${f.s11Result.includes("PAYMENT_MOCK_OK") ? "approved" : "pending"}`}>
              {f.s11Result || text.status}
            </div>
          </div>

          {/* S12 */}
          <div className="cb-card">
            <h3>{text.s12Title}</h3>
            <div className="safe-note">{text.s12Criteria}</div>
            <div className="cb-col">
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  data-testid="s12-shadow"
                  checked={f.s12Shadow}
                  onChange={(e) => patch({ s12Shadow: e.target.checked }, text.eventS12, "selection")}
                />
                Shadow DOM ({f.shadowResult === "SHADOW_OK" ? "OK" : "pending"})
              </label>
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  data-testid="s12-canvas"
                  checked={f.s12Canvas}
                  onChange={(e) => patch({ s12Canvas: e.target.checked }, text.eventS12, "selection")}
                />
                Canvas ({f.canvasClicked ? "OK" : "pending"})
              </label>
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  data-testid="s12-svg"
                  checked={f.s12Svg}
                  onChange={(e) => patch({ s12Svg: e.target.checked }, text.eventS12, "selection")}
                />
                SVG ({f.svgClicked ? "OK" : "pending"})
              </label>
              <button
                className="primary-action compact"
                data-testid="s12-check"
                onClick={() => {
                  const ok = f.s12Shadow && f.s12Canvas && f.s12Svg && f.shadowResult === "SHADOW_OK" && f.canvasClicked && f.svgClicked;
                  patch({ s12Result: ok ? "MIXED_UI_OK" : `shadow=${f.s12Shadow && f.shadowResult === "SHADOW_OK"} canvas=${f.s12Canvas && f.canvasClicked} svg=${f.s12Svg && f.svgClicked}` }, text.eventS12, "workflow");
                }}
              >
                {text.s12Check}
              </button>
            </div>
            <div className={`status-text ${f.s12Result === "MIXED_UI_OK" ? "approved" : "pending"}`}>
              {f.s12Result || text.status}
            </div>
          </div>
        </div>
      </section>
      </>
      ) : null}
    </div>
  );
}
