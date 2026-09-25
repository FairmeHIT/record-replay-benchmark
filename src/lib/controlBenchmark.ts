import { createRng, intBetween, pick, shuffle } from "./seed";
import type { ControlBenchmarkState, EvaluationCheck, EvaluationResult } from "./types";

interface ControlBenchmarkOptions {
  candidateFlip?: boolean;
}

function result(checks: EvaluationCheck[]): EvaluationResult {
  const passed = checks.filter((check) => check.passed).length;
  const success = passed === checks.length;
  const firstFailure = checks.find((check) => !check.passed);

  return {
    success,
    score: Number((passed / checks.length).toFixed(2)),
    checks,
    failureReason: firstFailure?.label ?? null,
  };
}

const textPool = ["自动化测试", "回放验证", "控件核验", "录制流程", "终态评分"];
const cityPool = ["北京", "上海", "深圳", "杭州", "南京"];
const namePool = ["王小明", "李建国", "张丽华", "赵明远", "陈晓燕"];
const typePool = ["个人", "企业"];
const regionPool = ["华东", "华南"];
const inputPool = ["TASK-06", "TASK-08", "TASK-12"];

export function createControlBenchmarkState(
  seed: number,
  options: ControlBenchmarkOptions = {},
): ControlBenchmarkState {
  const rng = createRng(`control-benchmark-${seed}`);
  const city = pick(rng, cityPool);
  const name = pick(rng, namePool);
  const scenarioType = pick(rng, typePool);
  const scenarioRegion = pick(rng, regionPool);

  return {
    kind: "control-benchmark",
    target: {
      textValue: pick(rng, textPool),
      passwordValue: "123456",
      radioValue: pick(rng, ["A", "B"]),
      switchOn: rng() > 0.5,
      selectValue: city,
      autocompleteValue: "北京",
      dateValue: `2026-09-${String(intBetween(rng, 10, 25)).padStart(2, "0")}`,
      sliderValue: intBetween(rng, 20, 80),
      shadowValue: "SHADOW-123",
      scrollTarget: "ITEM-073",
      paginationTarget: "TARGET-P4-03",
      scenarioName: name,
      scenarioType,
      scenarioDate: `2026-09-${String(intBetween(rng, 10, 25)).padStart(2, "0")}`,
      scenarioRegion,
      scenarioAmount: intBetween(rng, 50, 500),
      scenarioInput: pick(rng, inputPool),
      candidateFlip: options.candidateFlip ?? rng() > 0.5,
    },
    form: {
      buttonNormalOk: false,
      buttonDelayedOk: false,
      buttonDoubleOk: false,
      textValue: "",
      passwordValue: "",
      textareaValue: "",
      textChanged: false,
      radioValue: "",
      checkboxChecked: false,
      switchOn: false,
      choiceDone: false,
      selectValue: "",
      autocompleteValue: "",
      autocompleteDone: false,
      dateValue: "",
      timeValue: "",
      dateDone: false,
      tabActive: "tab1",
      accordionOpen: false,
      modalOpen: false,
      modalConfirmed: false,
      toastShown: false,
      treeOpen: false,
      sliderValue: 30,
      sliderDone: false,
      dragCompleted: false,
      canvasClicked: false,
      svgClicked: false,
      shadowValue: "",
      shadowResult: "",
      scrollTargetFound: false,
      tableSorted: false,
      paginationPage: 1,
      paginationTargetFound: false,
      hoverAction: "",
      contextAction: "",
      keyValue: "",
      s1Name: "",
      s1Type: "个人",
      s1Date: "",
      s1Result: "",
      s3Region: "全部",
      s3Loaded: false,
      s3Result: "",
      s4Page: 1,
      s4Result: "",
      s11Amount: 100,
      s11ModalOpen: false,
      s11Paid: false,
      s11DuplicateBlocked: false,
      s11TransactionId: "",
      s11Result: "",
      s12Shadow: false,
      s12Canvas: false,
      s12Svg: false,
      s12Result: "",
    },
  };
}

export function evaluateAtomicBasic(state: ControlBenchmarkState): EvaluationResult {
  return result([
    {
      id: "button-normal",
      label: "普通按钮点击成功",
      passed: state.form.buttonNormalOk,
    },
    {
      id: "button-delayed",
      label: "延迟按钮响应成功",
      passed: state.form.buttonDelayedOk,
    },
    {
      id: "button-double",
      label: "双击按钮成功",
      passed: state.form.buttonDoubleOk,
    },
    {
      id: "text",
      label: "文本、密码输入正确",
      passed:
        state.form.textValue.trim() === state.target.textValue &&
        state.form.passwordValue.trim() === state.target.passwordValue &&
        state.form.textChanged,
    },
    {
      id: "choice",
      label: "Radio、Checkbox、Switch 设置正确",
      passed:
        state.form.radioValue === state.target.radioValue &&
        state.form.checkboxChecked &&
        state.form.switchOn === state.target.switchOn &&
        state.form.choiceDone,
    },
    {
      id: "select",
      label: "下拉选择正确",
      passed: state.form.selectValue === state.target.selectValue,
    },
    {
      id: "slider",
      label: "滑块调整到目标值",
      passed: state.form.sliderValue === state.target.sliderValue && state.form.sliderDone,
    },
    {
      id: "modal",
      label: "弹窗确认完成",
      passed: state.form.modalConfirmed,
    },
    {
      id: "tabs",
      label: "Tab 切换到目标面板",
      passed: state.form.tabActive === "tab2",
    },
  ]);
}

export function evaluateAtomicAdvanced(state: ControlBenchmarkState): EvaluationResult {
  return result([
    {
      id: "autocomplete",
      label: "精确选择目标城市（消歧）",
      passed: state.form.autocompleteDone && state.form.autocompleteValue === state.target.autocompleteValue,
    },
    {
      id: "date",
      label: "日期设置正确",
      passed: state.form.dateDone && state.form.dateValue === state.target.dateValue,
    },
    {
      id: "drag",
      label: "拖拽放置成功",
      passed: state.form.dragCompleted,
    },
    {
      id: "canvas",
      label: "Canvas 圆形区域点击命中",
      passed: state.form.canvasClicked,
    },
    {
      id: "svg",
      label: "SVG 圆形点击成功",
      passed: state.form.svgClicked,
    },
    {
      id: "shadow",
      label: "Shadow DOM 输入正确",
      passed: state.form.shadowResult === "SHADOW_OK",
    },
    {
      id: "scroll",
      label: "无限滚动找到目标项",
      passed: state.form.scrollTargetFound,
    },
    {
      id: "table-sort",
      label: "表格按分数排序完成",
      passed: state.form.tableSorted,
    },
    {
      id: "pagination",
      label: "分页找到目标项",
      passed: state.form.paginationTargetFound,
    },
    {
      id: "accordion",
      label: "手风琴已展开",
      passed: state.form.accordionOpen,
    },
  ]);
}

export function evaluateCompositeScenarios(state: ControlBenchmarkState): EvaluationResult {
  return result([
    {
      id: "s01",
      label: "复合表单查询参数匹配",
      passed:
        state.form.s1Result === "FORM_SCENE_OK" &&
        state.form.s1Name === state.target.scenarioName &&
        state.form.s1Type === state.target.scenarioType &&
        state.form.s1Date === state.target.scenarioDate,
    },
    {
      id: "s03",
      label: "异步列表筛选正确",
      passed: state.form.s3Result === "ASYNC_TABLE_OK" && state.form.s3Region === state.target.scenarioRegion,
    },
    {
      id: "s04",
      label: "分页查找目标订单",
      passed: state.form.s4Result.includes("ORDER-X-042"),
    },
    {
      id: "s11",
      label: "高风险提交且防重成功",
      passed:
        state.form.s11Amount === state.target.scenarioAmount &&
        state.form.s11Result.includes("PAYMENT_MOCK_OK") &&
        state.form.s11Paid &&
        state.form.s11TransactionId.length > 0 &&
        state.form.s11DuplicateBlocked,
    },
    {
      id: "s12",
      label: "混合 UI 场景全部完成",
      passed: state.form.s12Result === "MIXED_UI_OK",
    },
  ]);
}
