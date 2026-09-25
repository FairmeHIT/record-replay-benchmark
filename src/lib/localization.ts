import type {
  AppId,
  BrowserLabState,
  CodeHostingState,
  ControlBenchmarkState,
  EvaluationResult,
  MediaReviewState,
  ProfileFormState,
  StorefrontState,
  TableApprovalState,
  TaskDefinition,
  TaskState,
  TicketState,
} from "./types";

export type Locale = "zh" | "en";

export const localeNames: Record<Locale, string> = {
  zh: "中文",
  en: "EN",
};

export const appNameText: Record<AppId, Record<Locale, string>> = {
  "control-lab": { zh: "控件实验室", en: "Control Lab" },
  tickets: { zh: "车票预订", en: "Ticket Booking" },
  storefront: { zh: "电商前台", en: "Storefront" },
  "code-hosting": { zh: "代码托管", en: "Code Hosting" },
  "browser-lab": { zh: "浏览器操作实验室", en: "Browser Lab" },
  "content-review": { zh: "内容运营台", en: "Content Desk" },
  "control-benchmark": { zh: "控件验证场", en: "Control Benchmark" },
};

export const difficultyText = {
  easy: { zh: "简单", en: "Easy" },
  medium: { zh: "中等", en: "Medium" },
  hard: { zh: "困难", en: "Hard" },
} as const;

export const eventTypeText = {
  input: { zh: "输入", en: "Input" },
  selection: { zh: "选择", en: "Select" },
  workflow: { zh: "流程", en: "Flow" },
  evaluation: { zh: "评测", en: "Eval" },
  reset: { zh: "重置", en: "Reset" },
} as const;

export const shellText = {
  zh: {
    brandTitle: "回放评测台",
    brandSubtitle: "录制与回放评测站",
    home: "首页",
    homeOverview: "功能总览",
    entry: "入口",
    seed: "Seed（种子）",
    liveInfo: "站点实时信息",
    todayVisits: "今日访问",
    theme: "主题",
    language: "语言",
    light: "亮",
    dark: "暗",
    taskReady: "任务已准备好",
    resetTask: "任务已重置",
    seedChanged: "Seed 已切换为",
    returnedHome: "已返回首页",
    reset: "重置",
    evaluate: "评测",
    exportReport: "导出 JSON 报告",
    reportExported: "JSON 报告已导出",
    evalPassed: "评测通过",
    evalFailed: "评测未通过，请检查失败项",
    instruction: "任务说明",
    taskPassed: "任务通过",
    taskFailed: "任务未通过",
    currentScore: "当前得分",
    pending: "待处理",
    evaluator: "评测器",
    complete: "已完成",
    notRun: "待评测",
    eventLog: "事件日志",
    eventsUnit: "条",
    taskLink: "任务链接",
    shareTask: "分享任务",
    shareHintBefore: "外部 agent 可以打开这个链接，完成任务后读取",
    shareHintAfter: "检查最终状态。",
    homeTitle: "录制与回放评测站",
    startFirstTask: "开始第一个任务",
    capability: "覆盖能力",
    heroTitle: "浏览器自动化录制回放评测靶场",
    heroCopy: "12 个确定性任务覆盖表单、表格、搜索、购物、文件、弹窗、拖拽、图片与超链接等真实网页操作，支持 Seed 复现、过程事件流与终态自动评分。",
    tasks: "任务",
    taskNumber: "任务编号",
    assignmentBoard: "评测任务分配表",
    siteStatus: "站点状态",
    online: "在线",
    cumulativeVisits: "累计访问",
    weatherRunning: "天气滚动条运行中",
    suggestedSplit: "建议分配",
    threePersonPack: "三人评测包",
    publicEntry: "公网入口",
    shareAddress: "分享地址",
    rangeOnline: "靶场在线",
    seedDeterministic: "Seed 确定性复现",
    evalDriven: "终态自动评测",
    bilingualReady: "中英双语界面",
    coverageModules: "个能力域",
    passCriteria: "通过标准：终态评测 100%",
  },
  en: {
    brandTitle: "Replay Bench",
    brandSubtitle: "Record & Replay Eval Site",
    home: "Home",
    homeOverview: "Overview",
    entry: "Start",
    seed: "Seed",
    liveInfo: "Live site info",
    todayVisits: "Visits today",
    theme: "Theme",
    language: "Language",
    light: "Light",
    dark: "Dark",
    taskReady: "Task is ready",
    resetTask: "Task reset",
    seedChanged: "Seed changed to",
    returnedHome: "Returned to home",
    reset: "Reset",
    evaluate: "Evaluate",
    exportReport: "Export JSON report",
    reportExported: "JSON report exported",
    evalPassed: "Evaluation passed",
    evalFailed: "Evaluation failed. Check the remaining items.",
    instruction: "Instruction",
    taskPassed: "Task passed",
    taskFailed: "Task failed",
    currentScore: "Current score",
    pending: "Pending",
    evaluator: "Evaluator",
    complete: "Complete",
    notRun: "Not run",
    eventLog: "Event log",
    eventsUnit: "events",
    taskLink: "Task link",
    shareTask: "Share task",
    shareHintBefore: "External agents can open this link, then read",
    shareHintAfter: "to inspect the final state.",
    homeTitle: "Record & Replay Eval Site",
    startFirstTask: "Start first task",
    capability: "Coverage",
    heroTitle: "A browser automation record & replay proving ground",
    heroCopy: "12 deterministic tasks covering forms, tables, search, checkout, files, dialogs, drag-and-drop, images, and hyperlinks — with seeded replay, event streams, and final-state scoring.",
    tasks: "Tasks",
    taskNumber: "Task IDs",
    assignmentBoard: "Evaluation assignment board",
    siteStatus: "Site status",
    online: "Online",
    cumulativeVisits: "Total visits",
    weatherRunning: "Weather ticker running",
    suggestedSplit: "Suggested split",
    threePersonPack: "Three-person pack",
    publicEntry: "Public entry",
    shareAddress: "Share URL",
    rangeOnline: "Range online",
    seedDeterministic: "Deterministic seeds",
    evalDriven: "Final-state evaluator",
    bilingualReady: "Bilingual zh / en",
    coverageModules: "capability domains",
    passCriteria: "Pass bar: final-state score 100%",
  },
} as const;

export const weatherText: Record<Locale, string[]> = {
  zh: [
    "深圳 28°C 多云，湿度 72%",
    "广州 29°C 阵雨，南风 2 级",
    "上海 24°C 晴，适合外勤测试",
    "北京 22°C 微风，页面运行稳定",
  ],
  en: [
    "Shenzhen 28°C cloudy, humidity 72%",
    "Guangzhou 29°C showers, south wind level 2",
    "Shanghai 24°C sunny, good for field testing",
    "Beijing 22°C breezy, site running normally",
  ],
};

export const featureModulesText: Array<{
  appId: AppId;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  features: Record<Locale, string[]>;
}> = [
  {
    appId: "control-lab",
    title: { zh: "控件实验室", en: "Control Lab" },
    description: { zh: "覆盖表单、表格、搜索、弹窗和审批流。", en: "Forms, tables, search, modals, and approval flows." },
    features: {
      zh: ["文本框", "下拉选择", "滑块", "复选框", "表格筛选", "审批弹窗"],
      en: ["Text inputs", "Selects", "Sliders", "Checkboxes", "Table filters", "Approval modal"],
    },
  },
  {
    appId: "storefront",
    title: { zh: "电商前台", en: "Storefront" },
    description: { zh: "模拟商品搜索、规格选择、购物车和订单提交。", en: "Product search, variants, cart, and checkout submission." },
    features: {
      zh: ["商品卡片", "库存规格", "优惠码", "地址填写", "下单按钮"],
      en: ["Product cards", "Inventory", "Coupons", "Address fields", "Checkout"],
    },
  },
  {
    appId: "content-review",
    title: { zh: "内容运营台", en: "Content Desk" },
    description: { zh: "新增图片点击、图片核验、超链接和发布动作。", en: "Image selection, image review, hyperlinks, and publishing." },
    features: {
      zh: ["图片素材", "超链接", "落地页核验", "文案发布"],
      en: ["Image assets", "Hyperlinks", "Landing-page checks", "Publishing"],
    },
  },
  {
    appId: "tickets",
    title: { zh: "车票预订", en: "Ticket Booking" },
    description: { zh: "覆盖异步查询、价格判断、席别筛选和验证码。", en: "Async search, price judgment, class filters, and mock captcha." },
    features: {
      zh: ["日期控件", "异步搜索", "筛选", "价格判断", "验证码"],
      en: ["Date picker", "Async search", "Filters", "Price choice", "Captcha"],
    },
  },
  {
    appId: "code-hosting",
    title: { zh: "代码托管", en: "Code Hosting" },
    description: { zh: "模拟 Issue、PR、检查、Review 和合并流程。", en: "Issue, pull request, checks, review, and merge flow." },
    features: {
      zh: ["Issue", "PR", "分支", "检查状态", "合并"],
      en: ["Issue", "PR", "Branch", "Checks", "Merge"],
    },
  },
  {
    appId: "browser-lab",
    title: { zh: "浏览器操作实验室", en: "Browser Lab" },
    description: { zh: "集中覆盖上传、下载、提示弹窗、干扰层和拖拽。", en: "Uploads, downloads, dialogs, interference layers, and drag-and-drop." },
    features: {
      zh: ["上传", "下载", "Alert", "Confirm", "干扰浮层", "拖拽排序"],
      en: ["Upload", "Download", "Alert", "Confirm", "Interference", "Drag sort"],
    },
  },
  {
    appId: "control-benchmark",
    title: { zh: "控件验证场", en: "Control Benchmark" },
    description: { zh: "覆盖 21 种原子控件与 12 种复合场景，含自动补全消歧、Canvas、SVG、Shadow DOM 等。", en: "21 atomic controls and 12 composite scenarios, including autocomplete disambiguation, Canvas, SVG, and Shadow DOM." },
    features: {
      zh: ["按钮", "文本", "选择控件", "自动补全", "Canvas/SVG", "Shadow DOM", "拖拽", "无限滚动", "表格排序", "分页"],
      en: ["Button", "Text", "Choice", "Autocomplete", "Canvas/SVG", "Shadow DOM", "Drag", "Infinite scroll", "Table sort", "Pagination"],
    },
  },
];

const classLabels = {
  Second: { zh: "二等座", en: "Second class" },
  First: { zh: "一等座", en: "First class" },
  Business: { zh: "商务座", en: "Business class" },
} as const;

const valueHints: Record<string, string> = {
  中国: "China",
  新加坡: "Singapore",
  美国: "United States",
  日本: "Japan",
  德国: "Germany",
  分析师: "Analyst",
  经理: "Manager",
  设计师: "Designer",
  工程师: "Engineer",
  运营专员: "Operations Specialist",
  杭州: "Hangzhou",
  上海: "Shanghai",
  北京: "Beijing",
  天津: "Tianjin",
  广州: "Guangzhou",
  深圳: "Shenzhen",
  苏州: "Suzhou",
  南京: "Nanjing",
  背包: "Backpacks",
  办公: "Office",
  厨房: "Kitchen",
  石墨黑: "Graphite black",
  蕨叶绿: "Fern green",
  云白: "Cloud white",
  黑色: "Black",
  白色: "White",
  鼠尾草绿: "Sage green",
  陶土色: "Terracotta",
  蓝色: "Blue",
  钢色: "Steel",
  发票: "Invoice",
  合同: "Contract",
  报表: "Report",
  已复核: "Reviewed",
  可归档: "Ready to archive",
  需要回放验证: "Needs replay verification",
  调度大屏: "Dispatch dashboard",
  商品货架: "Product shelf",
  服务柜台: "Service counter",
  回放验收规范: "Replay acceptance runbook",
  活动落地页: "Campaign landing page",
  客服帮助中心: "Support center",
};

function valueHint(value: string, locale: Locale): string {
  if (locale === "zh") return value;
  const hint = valueHints[value];
  return hint ? `${value} (${hint})` : value;
}

const taskText = {
  "control.profile-form": {
    title: { zh: "资料表单", en: "Profile Form" },
    summary: { zh: "填写混合输入资料表单并保存。", en: "Fill out a mixed-input profile form and save it." },
    tags: { zh: ["文本", "下拉", "滑块", "复选框"], en: ["Text", "Select", "Slider", "Checkbox"] },
  },
  "storefront.quick-cart": {
    title: { zh: "快速加入购物车", en: "Quick Add to Cart" },
    summary: { zh: "搜索商品，选择规格并加入购物车。", en: "Search for a product, choose variants, and add it to cart." },
    tags: { zh: ["搜索", "规格", "购物车"], en: ["Search", "Variants", "Cart"] },
  },
  "content.image-link-check": {
    title: { zh: "图片与链接核验", en: "Image and Link Check" },
    summary: { zh: "选择指定图片，点击目标链接并确认图片可用。", en: "Select the target image, click the target link, and approve the image." },
    tags: { zh: ["图片", "超链接", "素材"], en: ["Image", "Hyperlink", "Asset"] },
  },
  "control.table-approval": {
    title: { zh: "表格审批", en: "Table Approval" },
    summary: { zh: "在表格中找到指定申请，打开弹窗并审批通过。", en: "Find a request in a table, open the modal, and approve it." },
    tags: { zh: ["表格", "搜索", "弹窗"], en: ["Table", "Search", "Modal"] },
  },
  "tickets.reserve-cheapest": {
    title: { zh: "预订最低价车票", en: "Book Cheapest Ticket" },
    summary: { zh: "搜索车次，选择指定席别中最便宜的可售车票，填写模拟验证码并预订。", en: "Search trains, select the cheapest available class, solve the mock captcha, and reserve." },
    tags: { zh: ["搜索", "筛选", "验证码", "下单"], en: ["Search", "Filter", "Captcha", "Checkout"] },
  },
  "storefront.checkout-coupon": {
    title: { zh: "使用优惠码下单", en: "Checkout with Coupon" },
    summary: { zh: "搜索商品，选择规格，使用优惠码并提交模拟订单。", en: "Search a product, choose variants, apply a coupon, and submit the order." },
    tags: { zh: ["搜索", "规格", "购物车", "优惠码"], en: ["Search", "Variants", "Cart", "Coupon"] },
  },
  "codehost.issue-pr-merge": {
    title: { zh: "从 Issue 到合并", en: "Issue to Merge" },
    summary: { zh: "创建 Issue，打开 Pull Request，通过检查、完成评审并合并。", en: "Create an issue, open a pull request, pass checks, review, and merge." },
    tags: { zh: ["Markdown", "分支", "评审", "合并"], en: ["Markdown", "Branch", "Review", "Merge"] },
  },
  "tickets.reserve-team-trip": {
    title: { zh: "团队差旅车票", en: "Team Trip Ticket" },
    summary: { zh: "为指定乘客搜索差旅车票，选择最优可售车次并完成预订。", en: "Search a trip ticket for the passenger, choose the best train, and reserve it." },
    tags: { zh: ["搜索", "价格判断", "验证码", "订单"], en: ["Search", "Price choice", "Captcha", "Order"] },
  },
  "content.publish-campaign": {
    title: { zh: "发布图片落地页", en: "Publish Image Landing Page" },
    summary: { zh: "选择图片、核验链接、填写文案并发布模拟内容页。", en: "Select an image, verify a link, write copy, and publish the mock page." },
    tags: { zh: ["图片", "超链接", "发布"], en: ["Image", "Hyperlink", "Publish"] },
  },
  "browser.upload-download": {
    title: { zh: "上传下载核验", en: "Upload and Download Check" },
    summary: { zh: "下载样例文件，上传文件，选择类型并下载指定格式报表。", en: "Download a sample, upload a file, choose a type, and download the requested report." },
    tags: { zh: ["上传", "下载", "文件"], en: ["Upload", "Download", "File"] },
  },
  "browser.dialog-noise": {
    title: { zh: "弹窗与干扰处理", en: "Dialogs and Interference" },
    summary: { zh: "关闭干扰层，完成提示和确认弹窗，并在长列表中选择目标资料。", en: "Dismiss overlays, complete alert and confirmation dialogs, and select the target document in a long list." },
    tags: { zh: ["弹窗", "干扰", "长列表"], en: ["Dialog", "Interference", "Long list"] },
  },
  "browser.full-stress": {
    title: { zh: "综合浏览器压力流", en: "Full Browser Stress Flow" },
    summary: { zh: "完成上传、提示弹窗、干扰处理、长列表选择、拖拽排序、下载和提交。", en: "Complete upload, alert dialogs, overlays, list selection, drag sorting, download, and submit." },
    tags: { zh: ["上传", "下载", "弹窗", "拖拽", "噪声"], en: ["Upload", "Download", "Dialog", "Drag", "Noise"] },
  },
  "control-benchmark.atomic-basic": {
    title: { zh: "原子控件基础验证", en: "Atomic Control Basics" },
    summary: { zh: "完成按钮、文本、Radio/Checkbox/Switch、下拉、滑块、弹窗和 Tab 等基础控件交互。", en: "Complete button, text, radio/checkbox/switch, select, slider, modal, and tab interactions." },
    tags: { zh: ["按钮", "文本", "选择", "滑块", "弹窗"], en: ["Button", "Text", "Choice", "Slider", "Modal"] },
  },
  "control-benchmark.atomic-advanced": {
    title: { zh: "原子控件高级验证", en: "Atomic Control Advanced" },
    summary: { zh: "完成自动补全消歧、日期、拖拽、Canvas/SVG/Shadow DOM、无限滚动、表格排序和分页等高级控件。", en: "Complete autocomplete disambiguation, date, drag, Canvas/SVG/Shadow DOM, infinite scroll, table sort, and pagination." },
    tags: { zh: ["自动补全", "拖拽", "Canvas", "SVG", "Shadow DOM"], en: ["Autocomplete", "Drag", "Canvas", "SVG", "Shadow DOM"] },
  },
  "control-benchmark.composite-scenarios": {
    title: { zh: "复合场景验证", en: "Composite Scenarios" },
    summary: { zh: "完成复合表单查询、异步列表筛选、分页查找、高风险防重提交和混合 UI 场景。", en: "Complete composite form query, async list filter, paginated search, idempotent payment, and mixed UI scenarios." },
    tags: { zh: ["复合表单", "异步列表", "分页查找", "防重提交", "混合 UI"], en: ["Form", "Async list", "Pagination", "Idempotent", "Mixed UI"] },
  },
} as const;

export function localizedTask(task: TaskDefinition, locale: Locale) {
  const copy = taskText[task.id as keyof typeof taskText];
  return {
    appName: appNameText[task.appId][locale],
    title: copy?.title[locale] ?? task.title,
    summary: copy?.summary[locale] ?? task.summary,
    tags: copy?.tags[locale] ?? task.tags,
  };
}

export function localizedInstruction(task: TaskDefinition, state: TaskState, locale: Locale): string {
  if (locale === "zh") return task.instruction(state);

  switch (task.id) {
    case "control.profile-form": {
      const profile = state as ProfileFormState;
      return `Create a profile for ${profile.target.name}. Use ${profile.target.email}, country ${valueHint(profile.target.country, locale)}, role ${valueHint(profile.target.role, locale)}, budget ${profile.target.budget}, newsletter ${profile.target.newsletter ? "on" : "off"}. Accept the terms and save.`;
    }
    case "storefront.quick-cart": {
      const storefront = state as StorefrontState;
      return `Search for "${valueHint(storefront.target.query, locale)}", select product ${storefront.target.productId}, set variant ${valueHint(storefront.target.color, locale)} / ${storefront.target.size}, quantity ${storefront.target.quantity}, then add it to cart. Do not submit the order.`;
    }
    case "content.image-link-check": {
      const media = state as MediaReviewState;
      const image = media.images.find((item) => item.id === media.target.imageId);
      const link = media.links.find((item) => item.id === media.target.linkId);
      return `Select image ${media.target.imageId} (${image ? valueHint(image.title, locale) : "target image"}), click and verify "${link ? valueHint(link.label, locale) : media.target.linkId}", then approve the image.`;
    }
    case "control.table-approval": {
      const approval = state as TableApprovalState;
      return `Find request ${approval.targetRequestId}, select it, enter an approval comment, and approve the request.`;
    }
    case "tickets.reserve-cheapest":
    case "tickets.reserve-team-trip": {
      const ticket = state as TicketState;
      return `Book the cheapest available ${classLabels[ticket.target.className].en} ticket from ${valueHint(ticket.target.origin, locale)} to ${valueHint(ticket.target.destination, locale)} on ${ticket.target.date} for ${ticket.target.passenger}. Search first, set the departure filter to All day, then solve the mock captcha and reserve.`;
    }
    case "storefront.checkout-coupon": {
      const storefront = state as StorefrontState;
      return `Search for "${valueHint(storefront.target.query, locale)}", buy ${storefront.target.quantity} of ${storefront.target.productId}, set variant ${valueHint(storefront.target.color, locale)} / ${storefront.target.size}, use coupon ${storefront.target.coupon}, and set recipient ${storefront.target.recipient}.`;
    }
    case "codehost.issue-pr-merge": {
      const code = state as CodeHostingState;
      return `Create an issue titled "${code.target.issueTitle}" with label ${code.target.label} and assignee ${code.target.assignee}. Then create a pull request from branch ${code.target.branch}, modify ${code.target.filePath}, complete review and checks, then merge.`;
    }
    case "content.publish-campaign": {
      const media = state as MediaReviewState;
      const image = media.images.find((item) => item.id === media.target.imageId);
      const link = media.links.find((item) => item.id === media.target.linkId);
      return `Select image ${media.target.imageId} (${image ? valueHint(image.title, locale) : "target image"}), click and verify "${link ? valueHint(link.label, locale) : media.target.linkId}". Approve the image, include "${valueHint(media.target.captionKeyword, locale)}" in the copy, then publish the page.`;
    }
    case "browser.upload-download": {
      const lab = state as BrowserLabState;
      return `Download the sample file, upload any file, choose document type "${valueHint(lab.target.uploadType, locale)}", and parse it. Set report format to ${lab.target.reportFormat}, download the report, then submit.`;
    }
    case "browser.dialog-noise": {
      const lab = state as BrowserLabState;
      return `Close the preference banner, helper widget, and survey modal. Complete the alert, approval-code dialog (${lab.target.approvalCode}), and archive confirmation. Select ${lab.target.documentId} in the document list, then submit.`;
    }
    case "browser.full-stress": {
      const lab = state as BrowserLabState;
      return `Close all interference layers. Upload any file, choose document type "${valueHint(lab.target.uploadType, locale)}", and parse it. Complete the alert, approval code ${lab.target.approvalCode}, and archive confirmation. Select ${lab.target.documentId}, reorder the queue to ${lab.target.dragOrder.join(" > ")}, set report format ${lab.target.reportFormat}, download the report, include "${valueHint(lab.target.memoKeyword, locale)}" in the memo, then submit.`;
    }
    case "control-benchmark.atomic-basic": {
      const cb = state as ControlBenchmarkState;
      return `Complete basic control verification: click the normal button, delayed button (wait for response), and double-click the button; type "${cb.target.textValue}" in the text input and ${cb.target.passwordValue} in the password field; select Radio ${cb.target.radioValue}, check the checkbox, set the switch to ${cb.target.switchOn ? "on" : "off"}; select "${cb.target.selectValue}" from the dropdown; set the slider to ${cb.target.sliderValue}; open the modal and confirm; switch to the "Details" tab.`;
    }
    case "control-benchmark.atomic-advanced": {
      const cb = state as ControlBenchmarkState;
      return `Complete advanced control verification: in autocomplete, select "${cb.target.autocompleteValue}" exactly (candidates include similar items, do not misclick); set the date to ${cb.target.dateValue}; drag the card to the drop zone; click the Canvas blue circle; click the SVG circle; in Shadow DOM, enter ${cb.target.shadowValue} and submit; find ${cb.target.scrollTarget} in the infinite scroll and click it; click to sort the table by score; paginate to find ${cb.target.paginationTarget}; expand the accordion.`;
    }
    case "control-benchmark.composite-scenarios": {
      const cb = state as ControlBenchmarkState;
      return `Complete composite scenarios: S01 enter customer "${cb.target.scenarioName}", type "${cb.target.scenarioType}", date ${cb.target.scenarioDate}, then search; S03 filter region "${cb.target.scenarioRegion}" then load data; S04 page through to find ORDER-X-042 and stop; S11 make a payment once (amount ${cb.target.scenarioAmount}) and ensure duplicate submission is blocked; S12 check Shadow DOM, Canvas, and SVG all complete, then verify.`;
    }
    default:
      return task.instruction(state);
  }
}

const checkText: Record<string, Record<string, string>> = {
  "control.profile-form:name": { en: "Name matches the instruction" },
  "control.profile-form:email": { en: "Email matches the target contact" },
  "control.profile-form:country-role": { en: "Country and role are correct" },
  "control.profile-form:preferences": { en: "Budget and newsletter preference are correct" },
  "control.profile-form:saved": { en: "Terms accepted and profile saved" },
  "storefront.quick-cart:product": { en: "Correct product was searched and selected" },
  "storefront.quick-cart:variant": { en: "Color, size, and quantity match the instruction" },
  "storefront.quick-cart:cart": { en: "Product was added to cart" },
  "content.image-link-check:image": { en: "Target image was selected" },
  "content.image-link-check:link": { en: "Target hyperlink was clicked and verified" },
  "content.image-link-check:approval": { en: "Image was approved" },
  "control.table-approval:selected": { en: "Target request was selected" },
  "control.table-approval:approved": { en: "Request was approved" },
  "control.table-approval:comment": { en: "Approval comment was entered" },
  "tickets.reserve-cheapest:search": { en: "Route and travel date match the instruction" },
  "tickets.reserve-cheapest:train": { en: "Cheapest available requested class was selected" },
  "tickets.reserve-cheapest:passenger": { en: "Passenger name is correct" },
  "tickets.reserve-cheapest:captcha": { en: "Mock captcha was solved" },
  "tickets.reserve-cheapest:order": { en: "Ticket reservation was created" },
  "tickets.reserve-team-trip:search": { en: "Route and travel date match the instruction" },
  "tickets.reserve-team-trip:train": { en: "Cheapest available requested class was selected" },
  "tickets.reserve-team-trip:passenger": { en: "Passenger name is correct" },
  "tickets.reserve-team-trip:captcha": { en: "Mock captcha was solved" },
  "tickets.reserve-team-trip:order": { en: "Ticket reservation was created" },
  "storefront.checkout-coupon:product": { en: "Correct product was selected" },
  "storefront.checkout-coupon:variant": { en: "Color, size, and quantity match the instruction" },
  "storefront.checkout-coupon:coupon": { en: "Valid coupon was applied" },
  "storefront.checkout-coupon:recipient": { en: "Recipient and address were entered" },
  "storefront.checkout-coupon:order": { en: "Order submitted after adding to cart" },
  "codehost.issue-pr-merge:issue": { en: "Issue was created as requested" },
  "codehost.issue-pr-merge:branch": { en: "Pull request branch and file path are correct" },
  "codehost.issue-pr-merge:pr": { en: "Pull request was opened with a summary" },
  "codehost.issue-pr-merge:review-checks": { en: "Review and checks are complete" },
  "codehost.issue-pr-merge:merge": { en: "Pull request was merged" },
  "content.publish-campaign:image": { en: "Target image was selected and approved" },
  "content.publish-campaign:link": { en: "Specified hyperlink was verified" },
  "content.publish-campaign:caption": { en: "Publish copy includes the required keyword" },
  "content.publish-campaign:publish": { en: "Content page was published" },
  "browser.upload-download:sample": { en: "Sample file was downloaded" },
  "browser.upload-download:upload": { en: "File uploaded, correct type selected, and parsed" },
  "browser.upload-download:download": { en: "Report downloaded in the requested format" },
  "browser.upload-download:submitted": { en: "Task was submitted" },
  "browser.dialog-noise:noise": { en: "Interference layers were closed" },
  "browser.dialog-noise:dialogs": { en: "Dialog flow was completed" },
  "browser.dialog-noise:document": { en: "Target document was selected in the long list" },
  "browser.dialog-noise:submitted": { en: "Task was submitted" },
  "browser.full-stress:upload": { en: "Upload and parse completed" },
  "browser.full-stress:dialogs": { en: "Dialogs and confirmation flow completed" },
  "browser.full-stress:noise": { en: "All interference layers were closed" },
  "browser.full-stress:document": { en: "Target document was selected" },
  "browser.full-stress:drag-order": { en: "Drag order is correct" },
  "browser.full-stress:download": { en: "Report was downloaded" },
  "browser.full-stress:memo-submit": { en: "Memo includes keyword and task was submitted" },
  "control-benchmark.atomic-basic:button-normal": { en: "Normal button click succeeded" },
  "control-benchmark.atomic-basic:button-delayed": { en: "Delayed button response succeeded" },
  "control-benchmark.atomic-basic:button-double": { en: "Double-click button succeeded" },
  "control-benchmark.atomic-basic:text": { en: "Text and password inputs are correct" },
  "control-benchmark.atomic-basic:choice": { en: "Radio, checkbox, and switch are set correctly" },
  "control-benchmark.atomic-basic:select": { en: "Dropdown selection is correct" },
  "control-benchmark.atomic-basic:slider": { en: "Slider adjusted to target value" },
  "control-benchmark.atomic-basic:modal": { en: "Modal confirmation completed" },
  "control-benchmark.atomic-basic:tabs": { en: "Tab switched to target panel" },
  "control-benchmark.atomic-advanced:autocomplete": { en: "Exact target city selected (disambiguation)" },
  "control-benchmark.atomic-advanced:date": { en: "Date set correctly" },
  "control-benchmark.atomic-advanced:drag": { en: "Drag and drop succeeded" },
  "control-benchmark.atomic-advanced:canvas": { en: "Canvas circle area clicked" },
  "control-benchmark.atomic-advanced:svg": { en: "SVG circle clicked" },
  "control-benchmark.atomic-advanced:shadow": { en: "Shadow DOM input is correct" },
  "control-benchmark.atomic-advanced:scroll": { en: "Target item found in infinite scroll" },
  "control-benchmark.atomic-advanced:table-sort": { en: "Table sorted by score" },
  "control-benchmark.atomic-advanced:pagination": { en: "Target item found via pagination" },
  "control-benchmark.atomic-advanced:accordion": { en: "Accordion expanded" },
  "control-benchmark.composite-scenarios:s01": { en: "Composite form query parameters match" },
  "control-benchmark.composite-scenarios:s03": { en: "Async list filter is correct" },
  "control-benchmark.composite-scenarios:s04": { en: "Target order found via pagination" },
  "control-benchmark.composite-scenarios:s11": { en: "Idempotent payment and duplicate block succeeded" },
  "control-benchmark.composite-scenarios:s12": { en: "Mixed UI scenario fully completed" },
};

export function localizedEvaluation(taskId: string, evaluation: EvaluationResult, locale: Locale): EvaluationResult {
  if (locale === "zh") return evaluation;
  return {
    ...evaluation,
    failureReason: evaluation.failureReason
      ? checkText[`${taskId}:${evaluation.checks.find((check) => check.label === evaluation.failureReason)?.id ?? ""}`]?.en ??
        evaluation.failureReason
      : null,
    checks: evaluation.checks.map((check) => ({
      ...check,
      label: checkText[`${taskId}:${check.id}`]?.en ?? check.label,
    })),
  };
}
