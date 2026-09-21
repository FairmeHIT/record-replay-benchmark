import { createRng, intBetween, pick, shuffle } from "./seed";
import type { BrowserLabState, EvaluationCheck, EvaluationResult } from "./types";

interface BrowserLabOptions {
  cookieBannerVisible?: boolean;
  helperPanelVisible?: boolean;
  surveyModalVisible?: boolean;
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

function orderedIds(state: BrowserLabState): string[] {
  return state.dragItems.map((item) => item.id);
}

function isTargetOrder(state: BrowserLabState): boolean {
  return orderedIds(state).join("|") === state.target.dragOrder.join("|");
}

function isNoiseCleared(state: BrowserLabState): boolean {
  return (
    !state.noise.cookieBannerVisible &&
    !state.noise.helperPanelVisible &&
    !state.noise.surveyModalVisible
  );
}

export function createBrowserLabState(seed: number, options: BrowserLabOptions = {}): BrowserLabState {
  const rng = createRng(`browser-lab-${seed}`);
  const owners = ["李薇", "陈敏", "王诺", "张艾米", "欧文"] as const;
  const statuses = ["待归档", "待复核", "已同步", "需补充"] as const;
  const titles = [
    "供应商合同",
    "差旅报销单",
    "季度销售报表",
    "安全审计记录",
    "客户回访纪要",
    "库存盘点表",
    "发布验收清单",
    "采购审批单",
    "员工入职资料",
    "售后工单汇总",
    "门店巡检记录",
    "预算调整申请",
  ];
  const documents = shuffle(
    rng,
    Array.from({ length: 24 }, (_, index) => ({
      id: `DOC-${2026 + index}`,
      title: titles[index % titles.length],
      owner: pick(rng, owners),
      status: pick(rng, statuses),
    })),
  );
  const dragItems = shuffle(rng, [
    { id: "contract", label: "合同" },
    { id: "invoice", label: "发票" },
    { id: "report", label: "报表" },
    { id: "archive", label: "归档" },
  ]);
  const dragOrder = shuffle(rng, dragItems.map((item) => item.id));
  const initialDragItems =
    dragItems.map((item) => item.id).join("|") === dragOrder.join("|")
      ? [...dragItems].reverse()
      : dragItems;

  return {
    kind: "browser-lab",
    target: {
      sampleFileName: `record-replay-sample-${intBetween(rng, 100, 999)}.csv`,
      uploadType: pick(rng, ["发票", "合同", "报表"]),
      reportFormat: pick(rng, ["CSV", "PDF", "JSON"] as const),
      approvalCode: String(intBetween(rng, 3000, 9999)),
      documentId: pick(rng, documents).id,
      dragOrder,
      memoKeyword: pick(rng, ["已复核", "可归档", "需要回放验证"]),
    },
    upload: {
      sampleDownloaded: false,
      fileName: "",
      documentType: "",
      parsed: false,
    },
    download: {
      format: "CSV",
      generated: false,
      fileName: "",
    },
    dialogs: {
      alertAcknowledged: false,
      alertOpen: false,
      approvalInput: "",
      promptPassed: false,
      promptOpen: false,
      confirmAccepted: false,
      confirmOpen: false,
    },
    noise: {
      cookieBannerVisible: options.cookieBannerVisible ?? true,
      helperPanelVisible: options.helperPanelVisible ?? false,
      surveyModalVisible: options.surveyModalVisible ?? false,
    },
    documents,
    documentQuery: "",
    selectedDocumentId: null,
    dragItems: initialDragItems,
    memo: "",
    submitted: false,
  };
}

export function evaluateBrowserUploadDownload(state: BrowserLabState): EvaluationResult {
  return result([
    {
      id: "sample",
      label: "已下载样例文件",
      passed: state.upload.sampleDownloaded,
    },
    {
      id: "upload",
      label: "已上传文件并选择正确类型",
      passed:
        state.upload.fileName.trim().length > 0 &&
        state.upload.documentType === state.target.uploadType &&
        state.upload.parsed,
    },
    {
      id: "download",
      label: "已按指定格式下载报表",
      passed:
        state.download.generated &&
        state.download.format === state.target.reportFormat &&
        state.download.fileName.trim().length > 0,
    },
    {
      id: "submitted",
      label: "已提交任务",
      passed: state.submitted,
    },
  ]);
}

export function evaluateBrowserDialogNoise(state: BrowserLabState): EvaluationResult {
  return result([
    {
      id: "noise",
      label: "干扰层已关闭",
      passed: isNoiseCleared(state),
    },
    {
      id: "dialogs",
      label: "弹窗流程已完成",
      passed:
        state.dialogs.alertAcknowledged &&
        state.dialogs.promptPassed &&
        state.dialogs.confirmAccepted,
    },
    {
      id: "document",
      label: "已在长列表中选择目标资料",
      passed: state.selectedDocumentId === state.target.documentId,
    },
    {
      id: "submitted",
      label: "已提交任务",
      passed: state.submitted,
    },
  ]);
}

export function evaluateBrowserFullStress(state: BrowserLabState): EvaluationResult {
  return result([
    {
      id: "upload",
      label: "上传解析完成",
      passed:
        state.upload.fileName.trim().length > 0 &&
        state.upload.documentType === state.target.uploadType &&
        state.upload.parsed,
    },
    {
      id: "dialogs",
      label: "提示和确认弹窗流程完成",
      passed:
        state.dialogs.alertAcknowledged &&
        state.dialogs.promptPassed &&
        state.dialogs.confirmAccepted,
    },
    {
      id: "noise",
      label: "干扰浮层全部关闭",
      passed: isNoiseCleared(state),
    },
    {
      id: "document",
      label: "目标资料已选中",
      passed: state.selectedDocumentId === state.target.documentId,
    },
    {
      id: "drag-order",
      label: "拖拽排序正确",
      passed: isTargetOrder(state),
      detail: `目标顺序：${state.target.dragOrder.join(" > ")}`,
    },
    {
      id: "download",
      label: "报表已下载",
      passed:
        state.download.generated &&
        state.download.format === state.target.reportFormat &&
        state.download.fileName.trim().length > 0,
    },
    {
      id: "memo-submit",
      label: "备注包含关键词并提交",
      passed: state.memo.includes(state.target.memoKeyword) && state.submitted,
    },
  ]);
}
