import { CheckCircle2, GitMerge, GitPullRequest, MessageSquarePlus } from "lucide-react";
import type { Locale } from "../lib/localization";
import type { CodeHostingState, EventRecord } from "../lib/types";

interface CodeHostingProps {
  locale: Locale;
  state: CodeHostingState;
  onChange: (next: CodeHostingState, label: string, type?: EventRecord["type"]) => void;
}

const codeHostText = {
  zh: {
    app: "代码托管",
    created: "已创建",
    issueTitle: "Issue 标题",
    description: "描述",
    acceptPlaceholder: "填写验收说明",
    assignee: "负责人",
    createIssue: "创建 Issue",
    reviewMerge: "评审与合并",
    merged: "已合并",
    branch: "分支",
    changedFile: "修改文件",
    summary: "摘要",
    summaryPlaceholder: "描述实现内容",
    createPr: "创建 PR",
    checks: "检查",
    merge: "合并",
    eventIssueTitle: "填写 Issue 标题",
    eventIssueBody: "填写 Issue 描述",
    eventLabel: "选择 Issue 标签",
    eventAssignee: "选择负责人",
    eventCreateIssue: "创建 Issue",
    eventBranch: "填写分支名",
    eventFile: "填写修改文件路径",
    eventSummary: "填写 Pull Request 摘要",
    eventCreatePr: "创建 Pull Request",
    eventReview: "完成 Review",
    eventChecks: "标记检查通过",
    eventMerge: "合并 Pull Request",
  },
  en: {
    app: "Code Hosting",
    created: "Created",
    issueTitle: "Issue title",
    description: "Description",
    acceptPlaceholder: "Write acceptance notes",
    assignee: "Assignee",
    createIssue: "Create issue",
    reviewMerge: "Review and merge",
    merged: "Merged",
    branch: "Branch",
    changedFile: "Changed file",
    summary: "Summary",
    summaryPlaceholder: "Describe the implementation",
    createPr: "Create PR",
    checks: "Checks",
    merge: "Merge",
    eventIssueTitle: "Entered Issue title",
    eventIssueBody: "Entered Issue description",
    eventLabel: "Selected Issue label",
    eventAssignee: "Selected assignee",
    eventCreateIssue: "Created Issue",
    eventBranch: "Entered branch name",
    eventFile: "Entered changed file path",
    eventSummary: "Entered Pull Request summary",
    eventCreatePr: "Created Pull Request",
    eventReview: "Completed review",
    eventChecks: "Marked checks passed",
    eventMerge: "Merged Pull Request",
  },
} as const;

export function CodeHostingView({ locale, state, onChange }: CodeHostingProps) {
  const text = codeHostText[locale];
  const canCreateIssue = state.issue.title.trim().length > 0;
  const canCreatePr =
    state.issue.created &&
    state.pullRequest.branch.trim().length > 0 &&
    state.pullRequest.filePath.trim().length > 0 &&
    state.pullRequest.summary.trim().length >= 12;

  const updateIssue = (patch: Partial<CodeHostingState["issue"]>, label: string) => {
    onChange({ ...state, issue: { ...state.issue, ...patch } }, label);
  };
  const updatePr = (patch: Partial<CodeHostingState["pullRequest"]>, label: string) => {
    onChange({ ...state, pullRequest: { ...state.pullRequest, ...patch } }, label);
  };

  return (
    <div className="workspace-grid">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{text.app}</p>
            <h2>Issue</h2>
          </div>
          {state.issue.created ? <span className="status-pill success">{text.created}</span> : null}
        </div>

        <label>
          <span>{text.issueTitle}</span>
          <input
            value={state.issue.title}
            onChange={(event) => updateIssue({ title: event.target.value }, text.eventIssueTitle)}
            placeholder={state.target.issueTitle}
          />
        </label>
        <label>
          <span>{text.description}</span>
          <textarea
            value={state.issue.body}
            onChange={(event) => updateIssue({ body: event.target.value }, text.eventIssueBody)}
            placeholder={text.acceptPlaceholder}
          />
        </label>
        <div className="form-grid two">
          <label>
            <span>Label</span>
            <select
              value={state.issue.label}
              onChange={(event) => updateIssue({ label: event.target.value }, text.eventLabel)}
            >
              {["enhancement", "bug", "docs"].map((label) => (
                <option key={label}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            <span>{text.assignee}</span>
            <select
              value={state.issue.assignee}
              onChange={(event) => updateIssue({ assignee: event.target.value }, text.eventAssignee)}
            >
              {["Li Wei", "Maya Chen", "Noah Patel", "Amelia Zhang", "Owen Rivera"].map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>
        <button
          className="primary-action"
          type="button"
          disabled={!canCreateIssue}
          onClick={() => updateIssue({ created: true }, text.eventCreateIssue)}
        >
          <MessageSquarePlus size={18} />
          {text.createIssue}
        </button>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Pull Request</p>
            <h2>{text.reviewMerge}</h2>
          </div>
          {state.pullRequest.merged ? <span className="status-pill success">{text.merged}</span> : null}
        </div>

        <div className="form-grid two">
          <label>
            <span>{text.branch}</span>
            <input
              value={state.pullRequest.branch}
              onChange={(event) => updatePr({ branch: event.target.value }, text.eventBranch)}
              placeholder={state.target.branch}
            />
          </label>
          <label>
            <span>{text.changedFile}</span>
            <input
              value={state.pullRequest.filePath}
              onChange={(event) => updatePr({ filePath: event.target.value }, text.eventFile)}
              placeholder={state.target.filePath}
            />
          </label>
        </div>
        <label>
          <span>{text.summary}</span>
          <textarea
            value={state.pullRequest.summary}
            onChange={(event) => updatePr({ summary: event.target.value }, text.eventSummary)}
            placeholder={text.summaryPlaceholder}
          />
        </label>

        <div className="button-row wrap">
          <button
            className="secondary-action"
            type="button"
            disabled={!canCreatePr}
            onClick={() => updatePr({ opened: true }, text.eventCreatePr)}
          >
            <GitPullRequest size={17} />
            {text.createPr}
          </button>
          <button
            className="secondary-action"
            type="button"
            disabled={!state.pullRequest.opened}
            onClick={() => updatePr({ reviewed: true }, text.eventReview)}
          >
            <CheckCircle2 size={17} />
            Review
          </button>
          <button
            className="secondary-action"
            type="button"
            disabled={!state.pullRequest.opened}
            onClick={() => updatePr({ checksPassed: true }, text.eventChecks)}
          >
            <CheckCircle2 size={17} />
            {text.checks}
          </button>
          <button
            className="primary-action compact"
            type="button"
            disabled={!state.pullRequest.opened || !state.pullRequest.reviewed || !state.pullRequest.checksPassed}
            onClick={() => updatePr({ merged: true }, text.eventMerge)}
          >
            <GitMerge size={17} />
            {text.merge}
          </button>
        </div>
      </section>
    </div>
  );
}
