import { Check, Filter, Save, Search } from "lucide-react";
import type { Locale } from "../lib/localization";
import type { EventRecord, ProfileFormState, TableApprovalState } from "../lib/types";

interface ViewProps<TState> {
  locale: Locale;
  state: TState;
  onChange: (next: TState, label: string, type?: EventRecord["type"]) => void;
}

const requestStatusLabels: Record<string, Record<Locale, string>> = {
  pending: { zh: "待审批", en: "Pending" },
  approved: { zh: "已通过", en: "Approved" },
  rejected: { zh: "已拒绝", en: "Rejected" },
};

const optionLabels: Record<string, Record<Locale, string>> = {
  中国: { zh: "中国", en: "China" },
  新加坡: { zh: "新加坡", en: "Singapore" },
  美国: { zh: "美国", en: "United States" },
  日本: { zh: "日本", en: "Japan" },
  德国: { zh: "德国", en: "Germany" },
  分析师: { zh: "分析师", en: "Analyst" },
  经理: { zh: "经理", en: "Manager" },
  设计师: { zh: "设计师", en: "Designer" },
  工程师: { zh: "工程师", en: "Engineer" },
  运营专员: { zh: "运营专员", en: "Operations Specialist" },
  设计: { zh: "设计", en: "Design" },
  运营: { zh: "运营", en: "Operations" },
  数据: { zh: "数据", en: "Data" },
  增长: { zh: "增长", en: "Growth" },
  财务: { zh: "财务", en: "Finance" },
};

const controlText = {
  zh: {
    lab: "控件实验室",
    profileTitle: "资料编辑",
    saved: "已保存",
    draft: "草稿",
    name: "姓名",
    email: "邮箱",
    country: "国家",
    role: "岗位",
    budget: "月度预算",
    newsletter: "订阅产品更新",
    terms: "接受评测条款",
    saveProfile: "保存资料",
    targetValues: "目标值",
    subscription: "订阅",
    on: "开启",
    off: "关闭",
    approvalQueue: "审批队列",
    target: "目标",
    searchPlaceholder: "搜索申请单、申请人或部门",
    approve: "审批",
    applicant: "申请人",
    department: "部门",
    amount: "金额",
    status: "状态",
    action: "操作",
    select: "选择",
    approvalDialog: "审批申请",
    approvalComment: "审批意见",
    commentPlaceholder: "至少填写 8 个字",
    cancel: "取消",
    confirmApprove: "确认通过",
    eventName: "填写姓名",
    eventEmail: "填写邮箱",
    eventCountry: "选择国家",
    eventRole: "选择岗位",
    eventBudget: "调整预算",
    eventNewsletter: "修改订阅偏好",
    eventTerms: "接受条款",
    eventSave: "保存资料",
    eventFilter: "筛选审批表格",
    eventLocate: "定位目标申请",
    eventOpenDialog: "打开审批弹窗",
    eventSelect: "选中",
    eventComment: "填写审批意见",
    eventCloseDialog: "关闭审批弹窗",
    eventApprove: "审批通过所选申请",
  },
  en: {
    lab: "Control Lab",
    profileTitle: "Profile editor",
    saved: "Saved",
    draft: "Draft",
    name: "Name",
    email: "Email",
    country: "Country",
    role: "Role",
    budget: "Monthly budget",
    newsletter: "Subscribe to product updates",
    terms: "Accept evaluation terms",
    saveProfile: "Save profile",
    targetValues: "Target values",
    subscription: "Subscription",
    on: "On",
    off: "Off",
    approvalQueue: "Approval queue",
    target: "Target",
    searchPlaceholder: "Search request, requester, or department",
    approve: "Approve",
    applicant: "Requester",
    department: "Department",
    amount: "Amount",
    status: "Status",
    action: "Action",
    select: "Select",
    approvalDialog: "Approval request",
    approvalComment: "Approval comment",
    commentPlaceholder: "Enter at least 8 characters",
    cancel: "Cancel",
    confirmApprove: "Approve",
    eventName: "Entered name",
    eventEmail: "Entered email",
    eventCountry: "Selected country",
    eventRole: "Selected role",
    eventBudget: "Adjusted budget",
    eventNewsletter: "Changed newsletter preference",
    eventTerms: "Accepted terms",
    eventSave: "Saved profile",
    eventFilter: "Filtered approval table",
    eventLocate: "Located target request",
    eventOpenDialog: "Opened approval dialog",
    eventSelect: "Selected",
    eventComment: "Entered approval comment",
    eventCloseDialog: "Closed approval dialog",
    eventApprove: "Approved selected request",
  },
} as const;

function localOption(value: string, locale: Locale) {
  return optionLabels[value]?.[locale] ?? value;
}

export function ProfileFormView({ locale, state, onChange }: ViewProps<ProfileFormState>) {
  const text = controlText[locale];
  const canSave =
    state.form.name.trim().length > 0 &&
    state.form.email.trim().length > 0 &&
    state.form.country.length > 0 &&
    state.form.role.length > 0 &&
    state.form.accepted;

  const updateForm = (
    patch: Partial<ProfileFormState["form"]>,
    label: string,
    type: EventRecord["type"] = "input",
  ) => {
    onChange(
      {
        ...state,
        form: { ...state.form, ...patch },
        saved: false,
      },
      label,
      type,
    );
  };

  return (
    <div className="workspace-grid">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{text.lab}</p>
            <h2>{text.profileTitle}</h2>
          </div>
          <span className={state.saved ? "status-pill success" : "status-pill"}>
            {state.saved ? text.saved : text.draft}
          </span>
        </div>

        <div className="form-grid two">
          <label>
            <span>{text.name}</span>
            <input
              value={state.form.name}
              onChange={(event) => updateForm({ name: event.target.value }, text.eventName)}
              placeholder={state.target.name}
            />
          </label>
          <label>
            <span>{text.email}</span>
            <input
              value={state.form.email}
              onChange={(event) => updateForm({ email: event.target.value }, text.eventEmail)}
              placeholder={state.target.email}
            />
          </label>
          <label>
            <span>{text.country}</span>
            <select
              value={state.form.country}
              onChange={(event) => updateForm({ country: event.target.value }, text.eventCountry, "selection")}
            >
              {["中国", "新加坡", "美国", "日本", "德国"].map((country) => (
                <option key={country} value={country}>{localOption(country, locale)}</option>
              ))}
            </select>
          </label>
          <label>
            <span>{text.role}</span>
            <select
              value={state.form.role}
              onChange={(event) => updateForm({ role: event.target.value }, text.eventRole, "selection")}
            >
              {["分析师", "经理", "设计师", "工程师", "运营专员"].map((role) => (
                <option key={role} value={role}>{localOption(role, locale)}</option>
              ))}
            </select>
          </label>
          <label className="wide">
            <span>{text.budget}: {state.form.budget}</span>
            <input
              type="range"
              min="3000"
              max="10000"
              step="1000"
              value={state.form.budget}
              onChange={(event) => updateForm({ budget: Number(event.target.value) }, text.eventBudget)}
            />
          </label>
        </div>

        <div className="toggle-row">
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={state.form.newsletter}
              onChange={(event) =>
                updateForm({ newsletter: event.target.checked }, text.eventNewsletter, "selection")
              }
            />
            <span>{text.newsletter}</span>
          </label>
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={state.form.accepted}
              onChange={(event) => updateForm({ accepted: event.target.checked }, text.eventTerms, "selection")}
            />
            <span>{text.terms}</span>
          </label>
        </div>

        <button
          className="primary-action"
          type="button"
          disabled={!canSave}
          onClick={() => onChange({ ...state, saved: true }, text.eventSave, "workflow")}
        >
          <Save size={18} />
          {text.saveProfile}
        </button>
      </section>

      <section className="panel muted-panel">
        <p className="eyebrow">{text.targetValues}</p>
        <dl className="target-list">
          <div>
            <dt>{text.name}</dt>
            <dd>{state.target.name}</dd>
          </div>
          <div>
            <dt>{text.email}</dt>
            <dd>{state.target.email}</dd>
          </div>
          <div>
            <dt>{text.country}</dt>
            <dd>{localOption(state.target.country, locale)}</dd>
          </div>
          <div>
            <dt>{text.role}</dt>
            <dd>{localOption(state.target.role, locale)}</dd>
          </div>
          <div>
            <dt>{text.budget}</dt>
            <dd>{state.target.budget}</dd>
          </div>
          <div>
            <dt>{text.subscription}</dt>
            <dd>{state.target.newsletter ? text.on : text.off}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

export function TableApprovalView({ locale, state, onChange }: ViewProps<TableApprovalState>) {
  const text = controlText[locale];
  const hasApprovalComment = state.approvalComment.trim().length >= 8;
  const filteredRows = state.rows.filter((row) => {
    const haystack = `${row.id} ${row.requester} ${row.department}`.toLowerCase();
    return haystack.includes(state.query.toLowerCase());
  });

  const approveSelected = () => {
    if (!state.selectedId) return;
    onChange(
      {
        ...state,
        rows: state.rows.map((row) =>
          row.id === state.selectedId ? { ...row, status: "approved" } : row,
        ),
        modalOpen: false,
      },
      text.eventApprove,
      "workflow",
    );
  };

  return (
    <section className="panel">
      <div className="panel-heading">
          <div>
          <p className="eyebrow">{text.lab}</p>
          <h2>{text.approvalQueue}</h2>
        </div>
        <span className="status-pill">{text.target} {state.targetRequestId}</span>
      </div>

      <div className="toolbar">
        <label className="search-field">
          <Search size={17} />
          <input
            value={state.query}
            onChange={(event) =>
              onChange({ ...state, query: event.target.value }, text.eventFilter)
            }
            placeholder={text.searchPlaceholder}
          />
        </label>
        <button
          className="secondary-action"
          type="button"
          onClick={() => onChange({ ...state, query: state.targetRequestId }, text.eventLocate)}
        >
          <Filter size={17} />
          {text.target}
        </button>
        <button
          className="primary-action compact"
          type="button"
          disabled={!state.selectedId}
          onClick={() => onChange({ ...state, modalOpen: true }, text.eventOpenDialog, "workflow")}
        >
          <Check size={17} />
          {text.approve}
        </button>
      </div>

      <div className="data-table" role="table" aria-label={text.approvalQueue}>
        <div className="data-row header" role="row">
          <span>ID</span>
          <span>{text.applicant}</span>
          <span>{text.department}</span>
          <span>{text.amount}</span>
          <span>{text.status}</span>
          <span>{text.action}</span>
        </div>
        {filteredRows.map((row) => (
          <div className={row.id === state.selectedId ? "data-row selected" : "data-row"} key={row.id} role="row">
            <span>{row.id}</span>
            <span>{row.requester}</span>
            <span>{localOption(row.department, locale)}</span>
            <span>${row.amount}</span>
            <span className={`status-text ${row.status}`}>{requestStatusLabels[row.status][locale]}</span>
            <button
              className="text-button"
              type="button"
              onClick={() => onChange({ ...state, selectedId: row.id }, `${text.eventSelect} ${row.id}`, "selection")}
            >
              {text.select}
            </button>
          </div>
        ))}
      </div>

      {state.modalOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-label={text.approvalDialog}>
            <h3>{text.approve} {state.selectedId}</h3>
            <label>
              <span>{text.approvalComment}</span>
              <textarea
                value={state.approvalComment}
                onChange={(event) =>
                  onChange(
                    { ...state, approvalComment: event.target.value },
                    text.eventComment,
                  )
                }
                placeholder={text.commentPlaceholder}
              />
            </label>
            <div className="modal-actions">
              <button
                className="secondary-action"
                type="button"
                onClick={() => onChange({ ...state, modalOpen: false }, text.eventCloseDialog)}
              >
                {text.cancel}
              </button>
              <button
                className="primary-action compact"
                type="button"
                disabled={!hasApprovalComment}
                onClick={approveSelected}
              >
                <Check size={17} />
                {text.confirmApprove}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
