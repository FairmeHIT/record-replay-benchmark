import {
  Check,
  CheckCircle2,
  Download,
  GripVertical,
  Search,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Locale } from "../lib/localization";
import type { BrowserLabState, EventRecord } from "../lib/types";

interface BrowserLabProps {
  locale: Locale;
  state: BrowserLabState;
  onChange: (next: BrowserLabState, label: string, type?: EventRecord["type"]) => void;
}

const formatExtensions: Record<BrowserLabState["target"]["reportFormat"], string> = {
  CSV: "csv",
  PDF: "pdf",
  JSON: "json",
};

const browserText = {
  zh: {
    app: "浏览器操作",
    filesDialogs: "文件与弹窗",
    noise: "干扰",
    waitingUpload: "等待上传文件",
    useDownloadedSample: "使用已下载样例",
    targetType: "当前目标类型",
    uploadFile: "上传文件",
    docType: "资料类型",
    chooseType: "选择类型",
    reportFormat: "报表格式",
    downloadSample: "下载样例",
    parseUpload: "解析上传",
    alert: "提示",
    alertDialog: "业务提示",
    acknowledge: "知道了",
    approvalCode: "审批码",
    confirmArchive: "确认归档",
    downloadReport: "下载报表",
    sample: "样例",
    parse: "解析",
    confirm: "确认",
    report: "报表",
    documentLibrary: "资料库",
    longList: "长列表定位",
    target: "目标",
    searchPlaceholder: "搜索资料编号、标题、负责人或状态",
    documentList: "资料列表",
    sortSubmit: "排序与提交",
    queue: "业务处理队列",
    dragList: "拖拽排序列表",
    memo: "处理备注",
    memoPlaceholder: "备注需包含",
    submitTask: "提交任务",
    banner: "站点偏好和下载权限已更新",
    gotIt: "知道了",
    closeHelper: "关闭客服浮窗",
    helper: "在线助手",
    helperCopy: "有新的流程建议等待处理。",
    survey: "满意度调查",
    surveyCopy: "本次操作完成后再填写即可。",
    later: "稍后处理",
    approvalDialog: "审批码验证",
    cancel: "取消",
    verify: "验证",
    businessAlert: "业务提示：备注中需要包含",
    confirmQuestion: "确认归档资料",
    eventDownloadSample: "下载样例文件",
    eventChooseFile: "选择上传文件",
    eventParseUpload: "解析上传文件",
    eventAlert: "确认提示弹窗",
    eventOpenAlert: "打开业务提示弹窗",
    eventOpenPrompt: "打开审批码弹窗",
    eventApprovalInput: "填写审批码",
    eventPromptPassed: "审批码验证通过",
    eventPromptFailed: "审批码验证失败",
    eventConfirmArchive: "确认归档资料",
    eventOpenConfirm: "打开归档确认弹窗",
    eventCancelArchive: "取消归档资料",
    eventDownloadReport: "下载业务报表",
    eventDrag: "调整拖拽排序",
    eventDocType: "选择资料类型",
    eventReportFormat: "选择报表格式",
    eventFilterDocs: "筛选资料列表",
    eventSelectDoc: "选择资料",
    eventMemo: "填写处理备注",
    eventSubmit: "提交浏览器操作任务",
    eventCloseBanner: "关闭偏好提示",
    eventCloseHelper: "关闭客服浮窗",
    eventCloseSurvey: "关闭调查弹窗",
    eventClosePrompt: "关闭审批码弹窗",
  },
  en: {
    app: "Browser Operations",
    filesDialogs: "Files and dialogs",
    noise: "Noise",
    waitingUpload: "Waiting for upload",
    useDownloadedSample: "Use downloaded sample",
    targetType: "Target type",
    uploadFile: "Upload file",
    docType: "Document type",
    chooseType: "Choose type",
    reportFormat: "Report format",
    downloadSample: "Download sample",
    parseUpload: "Parse upload",
    alert: "Alert",
    alertDialog: "Business notice",
    acknowledge: "Acknowledge",
    approvalCode: "Approval code",
    confirmArchive: "Confirm archive",
    downloadReport: "Download report",
    sample: "Sample",
    parse: "Parse",
    confirm: "Confirm",
    report: "Report",
    documentLibrary: "Document library",
    longList: "Long-list selection",
    target: "Target",
    searchPlaceholder: "Search document ID, title, owner, or status",
    documentList: "Document list",
    sortSubmit: "Sort and submit",
    queue: "Business queue",
    dragList: "Drag-sort list",
    memo: "Processing memo",
    memoPlaceholder: "Memo must include",
    submitTask: "Submit task",
    banner: "Site preferences and download permissions were updated",
    gotIt: "Got it",
    closeHelper: "Close helper widget",
    helper: "Online assistant",
    helperCopy: "A new workflow suggestion is waiting.",
    survey: "Satisfaction survey",
    surveyCopy: "You can complete this after the operation.",
    later: "Later",
    approvalDialog: "Approval-code check",
    cancel: "Cancel",
    verify: "Verify",
    businessAlert: "Business notice: the memo must include",
    confirmQuestion: "Archive document",
    eventDownloadSample: "Downloaded sample file",
    eventChooseFile: "Selected upload file",
    eventParseUpload: "Parsed upload file",
    eventAlert: "Acknowledged alert dialog",
    eventOpenAlert: "Opened business notice",
    eventOpenPrompt: "Opened approval-code dialog",
    eventApprovalInput: "Entered approval code",
    eventPromptPassed: "Approval code passed",
    eventPromptFailed: "Approval code failed",
    eventConfirmArchive: "Confirmed archive",
    eventOpenConfirm: "Opened archive confirmation",
    eventCancelArchive: "Canceled archive",
    eventDownloadReport: "Downloaded business report",
    eventDrag: "Adjusted drag order",
    eventDocType: "Selected document type",
    eventReportFormat: "Selected report format",
    eventFilterDocs: "Filtered document list",
    eventSelectDoc: "Selected document",
    eventMemo: "Entered processing memo",
    eventSubmit: "Submitted browser task",
    eventCloseBanner: "Closed preference banner",
    eventCloseHelper: "Closed helper widget",
    eventCloseSurvey: "Closed survey modal",
    eventClosePrompt: "Closed approval-code dialog",
  },
} as const;

const typeLabels: Record<string, Record<Locale, string>> = {
  发票: { zh: "发票", en: "Invoice" },
  合同: { zh: "合同", en: "Contract" },
  报表: { zh: "报表", en: "Report" },
};

const dragLabelsText: Record<string, Record<Locale, string>> = {
  合同: { zh: "合同", en: "Contract" },
  发票: { zh: "发票", en: "Invoice" },
  报表: { zh: "报表", en: "Report" },
  归档: { zh: "归档", en: "Archive" },
};

function localBusinessValue(value: string, locale: Locale) {
  return typeLabels[value]?.[locale] ?? dragLabelsText[value]?.[locale] ?? value;
}

function downloadTextFile(fileName: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function BrowserLabView({ locale, state, onChange }: BrowserLabProps) {
  const text = browserText[locale];
  const useNativeDialogs = new URLSearchParams(window.location.search).get("nativeDialogs") === "1";
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const filteredDocuments = useMemo(() => {
    const query = state.documentQuery.trim().toLowerCase();
    if (!query) return state.documents;

    return state.documents.filter((document) => {
      const text = `${document.id} ${document.title} ${document.owner} ${document.status}`.toLowerCase();
      return text.includes(query);
    });
  }, [state.documentQuery, state.documents]);
  const dragLabels = useMemo(() => {
    return Object.fromEntries(state.dragItems.map((item) => [item.id, localBusinessValue(item.label, locale)]));
  }, [locale, state.dragItems]);
  const pendingNoiseCount = [
    state.noise.cookieBannerVisible,
    state.noise.helperPanelVisible,
    state.noise.surveyModalVisible,
  ].filter(Boolean).length;

  const updateUpload = (
    patch: Partial<BrowserLabState["upload"]>,
    label: string,
    type: EventRecord["type"] = "input",
  ) => {
    onChange(
      {
        ...state,
        upload: { ...state.upload, ...patch },
        submitted: false,
      },
      label,
      type,
    );
  };

  const updateNoise = (patch: Partial<BrowserLabState["noise"]>, label: string) => {
    onChange({ ...state, noise: { ...state.noise, ...patch } }, label, "workflow");
  };

  const downloadSample = () => {
    downloadTextFile(
      state.target.sampleFileName,
      "id,amount,status\nRR-1001,128.00,ready\nRR-1002,74.00,ready\n",
      "text/csv;charset=utf-8",
    );
    updateUpload({ sampleDownloaded: true }, text.eventDownloadSample, "workflow");
  };

  const readSelectedFile = (file: File | undefined) => {
    if (!file) return;
    updateUpload({ fileName: file.name, parsed: false }, `${text.eventChooseFile} ${file.name}`);
  };

  const useDownloadedSample = () => {
    if (!state.upload.sampleDownloaded) return;
    updateUpload(
      { fileName: state.target.sampleFileName, parsed: false },
      `${text.eventChooseFile} ${state.target.sampleFileName}`,
      "workflow",
    );
  };

  const parseUpload = () => {
    updateUpload({ parsed: true }, text.eventParseUpload, "workflow");
  };

  const openAlert = () => {
    if (useNativeDialogs) {
      window.alert(`${text.businessAlert} "${state.target.memoKeyword}".`);
      onChange(
        {
          ...state,
          dialogs: { ...state.dialogs, alertAcknowledged: true },
        },
        text.eventAlert,
        "workflow",
      );
      return;
    }

    onChange(
      {
        ...state,
        dialogs: { ...state.dialogs, alertOpen: true },
      },
      text.eventOpenAlert,
      "workflow",
    );
  };

  const acknowledgeAlert = () => {
    onChange(
      {
        ...state,
        dialogs: { ...state.dialogs, alertOpen: false, alertAcknowledged: true },
      },
      text.eventAlert,
      "workflow",
    );
  };

  const openPrompt = () => {
    onChange(
      {
        ...state,
        dialogs: { ...state.dialogs, approvalInput: "", promptOpen: true, promptPassed: false },
      },
      text.eventOpenPrompt,
      "workflow",
    );
  };

  const updateApprovalInput = (approvalInput: string) => {
    onChange(
      {
        ...state,
        dialogs: { ...state.dialogs, approvalInput, promptPassed: false },
      },
      text.eventApprovalInput,
    );
  };

  const submitApprovalCode = () => {
    const promptPassed = state.dialogs.approvalInput.trim() === state.target.approvalCode;
    onChange(
      {
        ...state,
        dialogs: { ...state.dialogs, promptOpen: false, promptPassed },
      },
      promptPassed ? text.eventPromptPassed : text.eventPromptFailed,
      "workflow",
    );
  };

  const openConfirm = () => {
    if (!useNativeDialogs) {
      onChange(
        {
          ...state,
          dialogs: { ...state.dialogs, confirmOpen: true },
        },
        text.eventOpenConfirm,
        "workflow",
      );
      return;
    }

    const confirmAccepted = window.confirm(`${text.confirmQuestion} ${state.target.documentId}?`);
    onChange(
      {
        ...state,
        dialogs: { ...state.dialogs, confirmAccepted },
      },
      confirmAccepted ? text.eventConfirmArchive : text.eventCancelArchive,
      "workflow",
    );
  };

  const respondToConfirm = (confirmAccepted: boolean) => {
    onChange(
      {
        ...state,
        dialogs: { ...state.dialogs, confirmOpen: false, confirmAccepted },
      },
      confirmAccepted ? text.eventConfirmArchive : text.eventCancelArchive,
      "workflow",
    );
  };

  const downloadReport = () => {
    const extension = formatExtensions[state.download.format];
    const fileName = `browser-lab-report-${state.download.format.toLowerCase()}.${extension}`;
    downloadTextFile(
      fileName,
      `task,document,format\nbrowser-lab,${state.target.documentId},${state.download.format}\n`,
      "text/plain;charset=utf-8",
    );
    onChange(
      {
        ...state,
        download: { ...state.download, generated: true, fileName },
      },
      text.eventDownloadReport,
      "workflow",
    );
  };

  const moveDraggingItem = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;

    const source = state.dragItems.find((item) => item.id === draggingId);
    if (!source) return;

    const remaining = state.dragItems.filter((item) => item.id !== draggingId);
    const targetIndex = remaining.findIndex((item) => item.id === targetId);
    const nextItems = [
      ...remaining.slice(0, targetIndex),
      source,
      ...remaining.slice(targetIndex),
    ];

    onChange({ ...state, dragItems: nextItems, submitted: false }, text.eventDrag, "selection");
  };

  return (
    <>
      <div className="workspace-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{text.app}</p>
              <h2>{text.filesDialogs}</h2>
            </div>
            <span className="status-pill">{text.noise} {pendingNoiseCount}</span>
          </div>

          <div className="operation-stack">
            <div
              className="upload-zone"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                readSelectedFile(event.dataTransfer.files[0]);
              }}
            >
              <Upload size={22} />
              <div>
                <strong>{state.upload.fileName || text.waitingUpload}</strong>
                <span>{text.targetType}: {localBusinessValue(state.target.uploadType, locale)}</span>
              </div>
              <input
                aria-label={text.uploadFile}
                type="file"
                onChange={(event) => readSelectedFile(event.target.files?.[0])}
              />
            </div>
            {state.upload.sampleDownloaded ? (
              <button className="secondary-action compact" type="button" onClick={useDownloadedSample}>
                <Upload size={16} />
                {text.useDownloadedSample}
              </button>
            ) : null}

            <div className="form-grid two">
              <label>
                <span>{text.docType}</span>
                <select
                  value={state.upload.documentType}
                  onChange={(event) =>
                    updateUpload({ documentType: event.target.value, parsed: false }, text.eventDocType, "selection")
                  }
                >
                  <option value="">{text.chooseType}</option>
                  {["发票", "合同", "报表"].map((type) => (
                    <option key={type} value={type}>{localBusinessValue(type, locale)}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>{text.reportFormat}</span>
                <select
                  value={state.download.format}
                  onChange={(event) =>
                    onChange(
                      {
                        ...state,
                        download: {
                          format: event.target.value as BrowserLabState["download"]["format"],
                          generated: false,
                          fileName: "",
                        },
                        submitted: false,
                      },
                      text.eventReportFormat,
                      "selection",
                    )
                  }
                >
                  {["CSV", "PDF", "JSON"].map((format) => (
                    <option key={format}>{format}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="button-row wrap">
              <button className="secondary-action" type="button" onClick={downloadSample}>
                <Download size={17} />
                {text.downloadSample}
              </button>
              <button
                className="secondary-action"
                type="button"
                disabled={!state.upload.fileName || !state.upload.documentType}
                onClick={parseUpload}
              >
                <Check size={17} />
                {text.parseUpload}
              </button>
              <button className="secondary-action" type="button" onClick={openAlert}>
                <ShieldCheck size={17} />
                {text.alert}
              </button>
              <button className="secondary-action" type="button" onClick={openPrompt}>
                <ShieldCheck size={17} />
                {text.approvalCode}
              </button>
              <button className="secondary-action" type="button" onClick={openConfirm}>
                <CheckCircle2 size={17} />
                {text.confirmArchive}
              </button>
              <button className="primary-action compact" type="button" onClick={downloadReport}>
                <Download size={17} />
                {text.downloadReport}
              </button>
            </div>
          </div>

          <div className="browser-status-grid">
            <span className={state.upload.sampleDownloaded ? "status-chip pass" : "status-chip"}>{text.sample}</span>
            <span className={state.upload.parsed ? "status-chip pass" : "status-chip"}>{text.parse}</span>
            <span className={state.dialogs.alertAcknowledged ? "status-chip pass" : "status-chip"}>{text.alert}</span>
            <span className={state.dialogs.promptPassed ? "status-chip pass" : "status-chip"}>{text.approvalCode}</span>
            <span className={state.dialogs.confirmAccepted ? "status-chip pass" : "status-chip"}>{text.confirm}</span>
            <span className={state.download.generated ? "status-chip pass" : "status-chip"}>{text.report}</span>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{text.documentLibrary}</p>
              <h2>{text.longList}</h2>
            </div>
            <span className="status-pill">{text.target} {state.target.documentId}</span>
          </div>

          <label className="search-field full">
            <Search size={17} />
            <input
              value={state.documentQuery}
              onChange={(event) =>
                onChange(
                  { ...state, documentQuery: event.target.value, submitted: false },
                  text.eventFilterDocs,
                )
              }
              placeholder={text.searchPlaceholder}
            />
          </label>

          <div className="document-list" role="list" aria-label={text.documentList}>
            {filteredDocuments.map((document) => (
              <button
                className={state.selectedDocumentId === document.id ? "document-row selected" : "document-row"}
                key={document.id}
                type="button"
                onClick={() =>
                  onChange(
                    { ...state, selectedDocumentId: document.id, submitted: false },
                    `${text.eventSelectDoc} ${document.id}`,
                    "selection",
                  )
                }
              >
                <strong>{document.id}</strong>
                <span>{document.title}</span>
                <small>
                  {document.owner} · {document.status}
                </small>
              </button>
            ))}
          </div>
        </section>

        <section className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{text.sortSubmit}</p>
              <h2>{text.queue}</h2>
            </div>
            <span className="status-pill">
              {text.target} {state.target.dragOrder.map((id) => dragLabels[id]).join(" / ")}
            </span>
          </div>

          <div className="browser-lab-bottom">
            <div className="drag-board" aria-label={text.dragList}>
              {state.dragItems.map((item) => (
                <div
                  className={draggingId === item.id ? "drag-item dragging" : "drag-item"}
                  draggable
                  key={item.id}
                  onDragStart={() => setDraggingId(item.id)}
                  onDragEnd={() => setDraggingId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => moveDraggingItem(item.id)}
                >
                  <GripVertical size={18} />
                  <strong>{localBusinessValue(item.label, locale)}</strong>
                  <small>{item.id}</small>
                </div>
              ))}
            </div>

            <div className="submit-panel">
              <label>
                <span>{text.memo}</span>
                <textarea
                  value={state.memo}
                  onChange={(event) =>
                    onChange({ ...state, memo: event.target.value, submitted: false }, text.eventMemo)
                  }
                  placeholder={`${text.memoPlaceholder} "${state.target.memoKeyword}"`}
                />
              </label>
              <button
                className="primary-action"
                type="button"
                onClick={() => onChange({ ...state, submitted: true }, text.eventSubmit, "workflow")}
              >
                <CheckCircle2 size={18} />
                {text.submitTask}
              </button>
            </div>
          </div>
        </section>
      </div>

      {state.noise.cookieBannerVisible ? (
        <div className="noise-banner" role="status">
          <span>{text.banner}</span>
          <button
            className="secondary-action compact"
            type="button"
            onClick={() => updateNoise({ cookieBannerVisible: false }, text.eventCloseBanner)}
          >
            {text.gotIt}
          </button>
        </div>
      ) : null}

      {state.noise.helperPanelVisible ? (
        <div className="helper-widget">
          <button
            className="text-button close-button"
            type="button"
            onClick={() => updateNoise({ helperPanelVisible: false }, text.eventCloseHelper)}
            title={text.closeHelper}
          >
            <XCircle size={18} />
          </button>
          <strong>{text.helper}</strong>
          <p>{text.helperCopy}</p>
        </div>
      ) : null}

      {state.noise.surveyModalVisible ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal survey-modal" role="dialog" aria-label={text.survey}>
            <h3>{text.survey}</h3>
            <p>{text.surveyCopy}</p>
            <div className="modal-actions">
              <button
                className="secondary-action"
                type="button"
                onClick={() => updateNoise({ surveyModalVisible: false }, text.eventCloseSurvey)}
              >
                {text.later}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {state.dialogs.alertOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-label={text.alertDialog}>
            <h3>{text.alertDialog}</h3>
            <p>{text.businessAlert} "{state.target.memoKeyword}".</p>
            <div className="modal-actions">
              <button className="primary-action compact" type="button" onClick={acknowledgeAlert}>
                <Check size={17} />
                {text.acknowledge}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {state.dialogs.confirmOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-label={text.confirmArchive}>
            <h3>{text.confirmArchive}</h3>
            <p>{text.confirmQuestion} {state.target.documentId}?</p>
            <div className="modal-actions">
              <button
                className="secondary-action"
                type="button"
                onClick={() => respondToConfirm(false)}
              >
                {text.cancel}
              </button>
              <button
                className="primary-action compact"
                type="button"
                onClick={() => respondToConfirm(true)}
              >
                <CheckCircle2 size={17} />
                {text.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {state.dialogs.promptOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-label={text.approvalDialog}>
            <h3>{text.approvalDialog}</h3>
            <label>
              <span>{text.approvalCode}</span>
              <input
                inputMode="numeric"
                value={state.dialogs.approvalInput}
                onChange={(event) => updateApprovalInput(event.target.value)}
                placeholder={state.target.approvalCode}
              />
            </label>
            <div className="modal-actions">
              <button
                className="secondary-action"
                type="button"
                onClick={() =>
                  onChange(
                    {
                      ...state,
                      dialogs: { ...state.dialogs, approvalInput: "", promptOpen: false },
                    },
                    text.eventClosePrompt,
                  )
                }
              >
                {text.cancel}
              </button>
              <button
                className="primary-action compact"
                type="button"
                disabled={state.dialogs.approvalInput.trim().length === 0}
                onClick={submitApprovalCode}
              >
                <Check size={17} />
                {text.verify}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
