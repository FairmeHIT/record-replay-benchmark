import { createRng, intBetween, pick, shuffle } from "./seed";
import {
  createBrowserLabState,
  evaluateBrowserDialogNoise,
  evaluateBrowserFullStress,
  evaluateBrowserUploadDownload,
} from "./browserLab";
import type {
  BrowserLabState,
  CodeHostingState,
  EvaluationCheck,
  EvaluationResult,
  MediaReviewState,
  ProfileFormState,
  StorefrontState,
  TableApprovalState,
  TaskDefinition,
  TicketState,
} from "./types";

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

const people = [
  "Li Wei",
  "Maya Chen",
  "Noah Patel",
  "Amelia Zhang",
  "Owen Rivera",
] as const;

const countries = ["中国", "新加坡", "美国", "日本", "德国"] as const;
const roles = ["分析师", "经理", "设计师", "工程师", "运营专员"] as const;
const classLabels: Record<TicketState["target"]["className"], string> = {
  Second: "二等座",
  First: "一等座",
  Business: "商务座",
};

function createProfileState(seed: number): ProfileFormState {
  const rng = createRng(`profile-${seed}`);
  const name = pick(rng, people);
  const country = pick(rng, countries);
  const role = pick(rng, roles);

  return {
    kind: "profile-form",
    target: {
      name,
      email: `${name.toLowerCase().replaceAll(" ", ".")}@example.test`,
      country,
      role,
      budget: intBetween(rng, 4, 9) * 1000,
      newsletter: rng() > 0.45,
    },
    form: {
      name: "",
      email: "",
      country: countries[0],
      role: roles[0],
      budget: 5000,
      newsletter: false,
      accepted: false,
    },
    saved: false,
  };
}

function evaluateProfile(state: ProfileFormState): EvaluationResult {
  return result([
    {
      id: "name",
      label: "姓名与任务要求一致",
      passed: state.form.name.trim() === state.target.name,
    },
    {
      id: "email",
      label: "邮箱与目标联系人一致",
      passed: state.form.email.trim() === state.target.email,
    },
    {
      id: "country-role",
      label: "国家和岗位正确",
      passed: state.form.country === state.target.country && state.form.role === state.target.role,
    },
    {
      id: "preferences",
      label: "预算和订阅偏好正确",
      passed:
        state.form.budget === state.target.budget &&
        state.form.newsletter === state.target.newsletter,
    },
    {
      id: "saved",
      label: "已接受条款并保存档案",
      passed: state.form.accepted && state.saved,
    },
  ]);
}

function createTableApprovalState(seed: number): TableApprovalState {
  const rng = createRng(`approval-${seed}`);
  const departments = ["设计", "运营", "数据", "增长", "财务"] as const;
  const names = shuffle(rng, people);
  const rows = names.map((requester, index) => ({
    id: `REQ-${1020 + seed + index}`,
    requester,
    department: pick(rng, departments),
    amount: intBetween(rng, 12, 48) * 100,
    status: "pending" as const,
  }));
  const target = pick(rng, rows);

  return {
    kind: "table-approval",
    targetRequestId: target.id,
    rows: shuffle(rng, rows),
    query: "",
    selectedId: null,
    modalOpen: false,
    approvalComment: "",
  };
}

function evaluateTableApproval(state: TableApprovalState): EvaluationResult {
  const target = state.rows.find((row) => row.id === state.targetRequestId);

  return result([
    {
      id: "selected",
      label: "已选中目标申请单",
      passed: state.selectedId === state.targetRequestId,
    },
    {
      id: "approved",
      label: "申请单已审批通过",
      passed: target?.status === "approved",
    },
    {
      id: "comment",
      label: "已填写审批意见",
      passed: state.approvalComment.trim().length >= 8,
    },
  ]);
}

function createTicketState(seed: number): TicketState {
  const rng = createRng(`tickets-${seed}`);
  const routes = [
    ["杭州", "上海"],
    ["北京", "天津"],
    ["广州", "深圳"],
    ["苏州", "南京"],
  ] as const;
  const [origin, destination] = pick(rng, routes);
  const className = pick(rng, ["Second", "First", "Business"] as const);
  const captchaLeft = intBetween(rng, 2, 8);
  const captchaRight = intBetween(rng, 2, 8);
  const trainBase = [
    { id: "G102", depart: "08:10", arrive: "09:05" },
    { id: "G118", depart: "09:35", arrive: "10:28" },
    { id: "D232", depart: "13:20", arrive: "14:42" },
    { id: "G706", depart: "16:10", arrive: "17:09" },
  ];
  const trains = trainBase.map((train, index) => ({
    ...train,
    className: index % 2 === 0 ? className : pick(rng, ["Second", "First", "Business"] as const),
    price: intBetween(rng, 60, 220),
    seats: index === 0 && rng() > 0.5 ? 0 : intBetween(rng, 1, 8),
  }));

  return {
    kind: "ticket-booking",
    target: {
      origin,
      destination,
      date: `2026-10-${String(intBetween(rng, 10, 25)).padStart(2, "0")}`,
      passenger: pick(rng, people),
      className,
      captchaAnswer: captchaLeft + captchaRight,
    },
    trains: shuffle(rng, trains),
    search: {
      origin: "",
      destination: "",
      date: "",
    },
    searched: false,
    filter: "morning",
    selectedTrainId: null,
    passenger: "",
    captchaInput: "",
    order: null,
  };
}

export function cheapestMatchingTrain(state: TicketState) {
  return state.trains
    .filter((train) => train.className === state.target.className && train.seats > 0)
    .sort((left, right) => left.price - right.price)[0];
}

function evaluateTicket(state: TicketState): EvaluationResult {
  const expectedTrain = cheapestMatchingTrain(state);

  return result([
    {
      id: "search",
      label: "路线和出行日期符合任务要求",
      passed:
        state.searched &&
        state.search.origin === state.target.origin &&
        state.search.destination === state.target.destination &&
        state.search.date === state.target.date,
    },
    {
      id: "train",
      label: "已选择指定席别中最便宜的可售车次",
      passed: state.selectedTrainId === expectedTrain?.id,
      detail: expectedTrain ? `应选择 ${expectedTrain.id}` : "没有生成匹配车次",
    },
    {
      id: "passenger",
      label: "乘客姓名正确",
      passed: state.passenger.trim() === state.target.passenger,
    },
    {
      id: "captcha",
      label: "模拟验证码已填写正确",
      passed: Number(state.captchaInput) === state.target.captchaAnswer,
    },
    {
      id: "order",
      label: "车票订单已创建",
      passed:
        state.order?.status === "reserved" &&
        state.order.trainId === expectedTrain?.id &&
        state.order.passenger === state.target.passenger,
    },
  ]);
}

function createStorefrontState(seed: number): StorefrontState {
  const rng = createRng(`store-${seed}`);
  const products = shuffle(rng, [
    {
      id: "bag-arc",
      name: "弧线旅行背包",
      category: "背包",
      colors: ["石墨黑", "蕨叶绿", "云白"],
      sizes: ["20L", "28L"],
      price: 128,
      stock: 8,
    },
    {
      id: "lamp-focus",
      name: "专注护眼台灯",
      category: "办公",
      colors: ["黑色", "白色", "鼠尾草绿"],
      sizes: ["标准款"],
      price: 74,
      stock: 5,
    },
    {
      id: "mug-thermal",
      name: "保温马克杯",
      category: "厨房",
      colors: ["陶土色", "蓝色", "钢色"],
      sizes: ["350ml", "500ml"],
      price: 32,
      stock: 12,
    },
  ]);
  const product = pick(rng, products);

  return {
    kind: "storefront-checkout",
    target: {
      query: product.category,
      productId: product.id,
      color: pick(rng, product.colors),
      size: pick(rng, product.sizes),
      quantity: intBetween(rng, 1, 3),
      coupon: "SAVE10",
      recipient: pick(rng, people),
    },
    products,
    query: "",
    searched: false,
    selectedProductId: null,
    color: "",
    size: "",
    quantity: 1,
    coupon: "",
    recipient: "",
    address: "",
    cartAdded: false,
    orderPlaced: false,
  };
}

function evaluateStorefront(state: StorefrontState): EvaluationResult {
  return result([
    {
      id: "product",
      label: "已选择正确商品",
      passed: state.searched && state.selectedProductId === state.target.productId,
    },
    {
      id: "variant",
      label: "颜色、规格和数量符合任务要求",
      passed:
        state.color === state.target.color &&
        state.size === state.target.size &&
        state.quantity === state.target.quantity,
    },
    {
      id: "coupon",
      label: "已使用有效优惠码",
      passed: state.coupon.trim().toUpperCase() === state.target.coupon,
    },
    {
      id: "recipient",
      label: "已填写收件人与地址",
      passed: state.recipient.trim() === state.target.recipient && state.address.trim().length >= 10,
    },
    {
      id: "order",
      label: "加入购物车后已提交订单",
      passed: state.cartAdded && state.orderPlaced,
    },
  ]);
}

function evaluateStorefrontCart(state: StorefrontState): EvaluationResult {
  return result([
    {
      id: "product",
      label: "已搜索并选择正确商品",
      passed: state.searched && state.selectedProductId === state.target.productId,
    },
    {
      id: "variant",
      label: "颜色、规格和数量符合任务要求",
      passed:
        state.color === state.target.color &&
        state.size === state.target.size &&
        state.quantity === state.target.quantity,
    },
    {
      id: "cart",
      label: "商品已加入购物车",
      passed: state.cartAdded,
    },
  ]);
}

const mediaImages = [
  {
    id: "IMG-dispatch",
    title: "调度大屏",
    src: "/media/dispatch-board.svg",
    alt: "运营调度大屏插图",
  },
  {
    id: "IMG-shelf",
    title: "商品货架",
    src: "/media/product-shelf.svg",
    alt: "电商商品货架插图",
  },
  {
    id: "IMG-service",
    title: "服务柜台",
    src: "/media/service-counter.svg",
    alt: "客户服务柜台插图",
  },
] as const;

const mediaLinks = [
  {
    id: "LINK-runbook",
    label: "回放验收规范",
    url: "https://example.test/runbook/record-replay",
    description: "检查录制、技能生成、回放验收标准",
  },
  {
    id: "LINK-campaign",
    label: "活动落地页",
    url: "https://example.test/campaign/autumn",
    description: "检查活动页面跳转和追踪参数",
  },
  {
    id: "LINK-support",
    label: "客服帮助中心",
    url: "https://example.test/support",
    description: "检查帮助中心链接与图片说明一致",
  },
] as const;

function createMediaReviewState(seed: number): MediaReviewState {
  const rng = createRng(`media-${seed}`);
  const image = pick(rng, mediaImages);
  const link = pick(rng, mediaLinks);

  return {
    kind: "media-review",
    target: {
      imageId: image.id,
      linkId: link.id,
      captionKeyword: pick(rng, ["自动化验收", "回放质量", "测试覆盖"]),
    },
    images: shuffle(rng, [...mediaImages]),
    links: shuffle(rng, [...mediaLinks]),
    selectedImageId: null,
    openedLinkId: null,
    imageApproved: false,
    caption: "",
    published: false,
    publishedPage: null,
  };
}

function evaluateMediaCheck(state: MediaReviewState): EvaluationResult {
  return result([
    {
      id: "image",
      label: "已选择目标图片",
      passed: state.selectedImageId === state.target.imageId,
    },
    {
      id: "link",
      label: "已点击并核验目标超链接",
      passed: state.openedLinkId === state.target.linkId,
    },
    {
      id: "approval",
      label: "已确认图片可用",
      passed: state.imageApproved,
    },
  ]);
}

function evaluateMediaPublish(state: MediaReviewState): EvaluationResult {
  return result([
    {
      id: "image",
      label: "已选择目标图片并确认可用",
      passed: state.selectedImageId === state.target.imageId && state.imageApproved,
    },
    {
      id: "link",
      label: "已核验指定超链接",
      passed: state.openedLinkId === state.target.linkId,
    },
    {
      id: "caption",
      label: "发布文案包含指定关键词",
      passed: state.caption.includes(state.target.captionKeyword),
    },
    {
      id: "publish",
      label: "内容页已发布",
      passed:
        state.published &&
        state.publishedPage !== null &&
        state.publishedPage.imageId === state.target.imageId &&
        state.publishedPage.linkId === state.target.linkId &&
        state.publishedPage.caption.includes(state.target.captionKeyword),
    },
  ]);
}

function createCodeHostingState(seed: number): CodeHostingState {
  const rng = createRng(`code-${seed}`);
  const feature = pick(rng, ["报表导出", "深色模式开关", "审计筛选", "CSV 上传"]);

  return {
    kind: "code-hosting",
    target: {
      issueTitle: `新增${feature}`,
      label: pick(rng, ["enhancement", "bug", "docs"]),
      assignee: pick(rng, people),
      branch: `feature/${feature.replaceAll(" ", "-")}`,
      filePath: pick(rng, ["src/report.ts", "src/theme.ts", "docs/runbook.md"]),
    },
    issue: {
      title: "",
      body: "",
      label: "enhancement",
      assignee: people[0],
      created: false,
    },
    pullRequest: {
      branch: "",
      filePath: "",
      summary: "",
      opened: false,
      reviewed: false,
      checksPassed: false,
      merged: false,
    },
  };
}

function evaluateCodeHosting(state: CodeHostingState): EvaluationResult {
  return result([
    {
      id: "issue",
      label: "Issue 已按要求创建",
      passed:
        state.issue.created &&
        state.issue.title === state.target.issueTitle &&
        state.issue.label === state.target.label &&
        state.issue.assignee === state.target.assignee,
    },
    {
      id: "branch",
      label: "Pull Request 分支和文件路径正确",
      passed:
        state.pullRequest.branch === state.target.branch &&
        state.pullRequest.filePath === state.target.filePath,
    },
    {
      id: "pr",
      label: "Pull Request 已创建且包含摘要",
      passed: state.pullRequest.opened && state.pullRequest.summary.trim().length >= 12,
    },
    {
      id: "review-checks",
      label: "Review 和检查已完成",
      passed: state.pullRequest.reviewed && state.pullRequest.checksPassed,
    },
    {
      id: "merge",
      label: "Pull Request 已合并",
      passed: state.pullRequest.merged,
    },
  ]);
}

export const tasks: TaskDefinition[] = [
  {
    id: "control.profile-form",
    appId: "control-lab",
    appName: "控件实验室",
    title: "资料表单",
    difficulty: "easy",
    tags: ["文本", "下拉", "滑块", "复选框"],
    summary: "填写混合输入资料表单并保存。",
    createState: createProfileState,
    instruction: (state) => {
      const profile = state as ProfileFormState;
      return `为 ${profile.target.name} 创建资料。使用邮箱 ${profile.target.email}，国家选择 ${profile.target.country}，岗位选择 ${profile.target.role}，预算设为 ${profile.target.budget}，产品更新订阅设为${profile.target.newsletter ? "开启" : "关闭"}。接受条款并保存。`;
    },
    evaluate: (state) => evaluateProfile(state as ProfileFormState),
  },
  {
    id: "storefront.quick-cart",
    appId: "storefront",
    appName: "电商前台",
    title: "快速加入购物车",
    difficulty: "easy",
    tags: ["搜索", "规格", "购物车"],
    summary: "搜索商品，选择规格并加入购物车。",
    createState: (seed) => createStorefrontState(seed + 211),
    instruction: (state) => {
      const storefront = state as StorefrontState;
      return `搜索「${storefront.target.query}」，选择商品 ${storefront.target.productId}，把规格设为 ${storefront.target.color} / ${storefront.target.size}，数量设为 ${storefront.target.quantity}，然后加入购物车。无需提交订单。`;
    },
    evaluate: (state) => evaluateStorefrontCart(state as StorefrontState),
  },
  {
    id: "content.image-link-check",
    appId: "content-review",
    appName: "内容运营台",
    title: "图片与链接核验",
    difficulty: "easy",
    tags: ["图片", "超链接", "素材"],
    summary: "选择指定图片，点击目标链接并确认图片可用。",
    createState: (seed) => createMediaReviewState(seed + 317),
    instruction: (state) => {
      const media = state as MediaReviewState;
      const image = media.images.find((item) => item.id === media.target.imageId);
      const link = media.links.find((item) => item.id === media.target.linkId);
      return `在素材库中选择图片 ${media.target.imageId}（${image?.title ?? "目标图片"}），点击并核验「${link?.label ?? media.target.linkId}」链接，然后确认图片可用。`;
    },
    evaluate: (state) => evaluateMediaCheck(state as MediaReviewState),
  },
  {
    id: "control.table-approval",
    appId: "control-lab",
    appName: "控件实验室",
    title: "表格审批",
    difficulty: "medium",
    tags: ["表格", "搜索", "弹窗"],
    summary: "在表格中找到指定申请，打开弹窗并审批通过。",
    createState: createTableApprovalState,
    instruction: (state) => {
      const approval = state as TableApprovalState;
      return `找到申请单 ${approval.targetRequestId}，选中它，填写审批意见，并将该申请审批通过。`;
    },
    evaluate: (state) => evaluateTableApproval(state as TableApprovalState),
  },
  {
    id: "tickets.reserve-cheapest",
    appId: "tickets",
    appName: "车票预订",
    title: "预订最低价车票",
    difficulty: "hard",
    tags: ["搜索", "筛选", "验证码", "下单"],
    summary: "搜索车次，将出发时段设为全天，选择指定席别中最便宜的可售车票，填写模拟验证码并预订。",
    createState: createTicketState,
    instruction: (state) => {
      const ticket = state as TicketState;
      return `为 ${ticket.target.passenger} 预订 ${ticket.target.date} 从 ${ticket.target.origin} 到 ${ticket.target.destination} 的最便宜可售${classLabels[ticket.target.className]}车票。搜索后将出发时段设为“全天”，再填写模拟验证码并预订。`;
    },
    evaluate: (state) => evaluateTicket(state as TicketState),
  },
  {
    id: "storefront.checkout-coupon",
    appId: "storefront",
    appName: "电商前台",
    title: "使用优惠码下单",
    difficulty: "medium",
    tags: ["搜索", "规格", "购物车", "优惠码"],
    summary: "搜索商品，选择规格，使用优惠码并提交模拟订单。",
    createState: createStorefrontState,
    instruction: (state) => {
      const storefront = state as StorefrontState;
      return `搜索「${storefront.target.query}」，购买 ${storefront.target.quantity} 件 ${storefront.target.productId}，规格为 ${storefront.target.color} / ${storefront.target.size}，使用优惠码 ${storefront.target.coupon}，收件人为 ${storefront.target.recipient}。`;
    },
    evaluate: (state) => evaluateStorefront(state as StorefrontState),
  },
  {
    id: "codehost.issue-pr-merge",
    appId: "code-hosting",
    appName: "代码托管",
    title: "从 Issue 到合并",
    difficulty: "hard",
    tags: ["Markdown", "分支", "评审", "合并"],
    summary: "创建 Issue，打开 Pull Request，通过检查、完成评审并合并。",
    createState: createCodeHostingState,
    instruction: (state) => {
      const code = state as CodeHostingState;
      return `创建标题为「${code.target.issueTitle}」的 Issue，标签为 ${code.target.label}，负责人为 ${code.target.assignee}。然后从分支 ${code.target.branch} 创建 Pull Request，修改文件 ${code.target.filePath}，完成 review 和检查后合并。`;
    },
    evaluate: (state) => evaluateCodeHosting(state as CodeHostingState),
  },
  {
    id: "tickets.reserve-team-trip",
    appId: "tickets",
    appName: "车票预订",
    title: "团队差旅车票",
    difficulty: "hard",
    tags: ["搜索", "价格判断", "验证码", "订单"],
    summary: "为指定乘客搜索差旅车票，将出发时段设为全天，选择最优可售车次并完成预订。",
    createState: (seed) => createTicketState(seed + 503),
    instruction: (state) => {
      const ticket = state as TicketState;
      return `为差旅乘客 ${ticket.target.passenger} 预订 ${ticket.target.date} 从 ${ticket.target.origin} 到 ${ticket.target.destination} 的最便宜可售${classLabels[ticket.target.className]}车票。需要先搜索车次，将出发时段设为“全天”，再填写模拟验证码并完成预订。`;
    },
    evaluate: (state) => evaluateTicket(state as TicketState),
  },
  {
    id: "content.publish-campaign",
    appId: "content-review",
    appName: "内容运营台",
    title: "发布图片落地页",
    difficulty: "medium",
    tags: ["图片", "超链接", "发布"],
    summary: "选择图片、核验链接、填写文案并发布模拟内容页。",
    createState: createMediaReviewState,
    instruction: (state) => {
      const media = state as MediaReviewState;
      const image = media.images.find((item) => item.id === media.target.imageId);
      const link = media.links.find((item) => item.id === media.target.linkId);
      return `选择图片 ${media.target.imageId}（${image?.title ?? "目标图片"}），点击并核验「${link?.label ?? media.target.linkId}」链接。确认图片可用后，发布文案中必须包含「${media.target.captionKeyword}」，最后发布内容页。`;
    },
    evaluate: (state) => evaluateMediaPublish(state as MediaReviewState),
  },
  {
    id: "browser.upload-download",
    appId: "browser-lab",
    appName: "浏览器操作实验室",
    title: "上传下载核验",
    difficulty: "easy",
    tags: ["上传", "下载", "文件"],
    summary: "下载样例文件，上传文件，选择类型并下载指定格式报表。",
    createState: (seed) => createBrowserLabState(seed + 701),
    instruction: (state) => {
      const lab = state as BrowserLabState;
      return `下载样例文件，上传任意文件，将资料类型选择为「${lab.target.uploadType}」，完成解析。然后把报表格式设为 ${lab.target.reportFormat} 并下载报表，最后提交任务。`;
    },
    evaluate: (state) => evaluateBrowserUploadDownload(state as BrowserLabState),
  },
  {
    id: "browser.dialog-noise",
    appId: "browser-lab",
    appName: "浏览器操作实验室",
    title: "弹窗与干扰处理",
    difficulty: "medium",
    tags: ["弹窗", "干扰", "长列表"],
    summary: "关闭干扰层，完成提示和确认弹窗，并在长列表中选择目标资料。",
    createState: (seed) =>
      createBrowserLabState(seed + 809, {
        helperPanelVisible: true,
        surveyModalVisible: true,
      }),
    instruction: (state) => {
      const lab = state as BrowserLabState;
      return `关闭页面上的偏好提示、在线助手和调查弹窗。依次完成提示弹窗、审批码弹窗（审批码为 ${lab.target.approvalCode}）和确认归档弹窗。随后在资料库中找到并选择 ${lab.target.documentId}，最后提交任务。`;
    },
    evaluate: (state) => evaluateBrowserDialogNoise(state as BrowserLabState),
  },
  {
    id: "browser.full-stress",
    appId: "browser-lab",
    appName: "浏览器操作实验室",
    title: "综合浏览器压力流",
    difficulty: "hard",
    tags: ["上传", "下载", "弹窗", "拖拽", "噪声"],
    summary: "完成上传、提示弹窗、干扰处理、长列表选择、拖拽排序、下载和提交。",
    createState: (seed) =>
      createBrowserLabState(seed + 907, {
        helperPanelVisible: true,
        surveyModalVisible: true,
      }),
    instruction: (state) => {
      const lab = state as BrowserLabState;
      return `关闭所有干扰层。上传任意文件，资料类型选择「${lab.target.uploadType}」并解析。完成提示弹窗、审批码 ${lab.target.approvalCode} 和确认归档。选择资料 ${lab.target.documentId}，将业务处理队列拖拽为 ${lab.target.dragOrder.join(" > ")}，把报表格式设为 ${lab.target.reportFormat} 并下载报表。备注中写入「${lab.target.memoKeyword}」，最后提交任务。`;
    },
    evaluate: (state) => evaluateBrowserFullStress(state as BrowserLabState),
  },
];

export function findTask(taskId: string): TaskDefinition {
  return tasks.find((task) => task.id === taskId) ?? tasks[0];
}
