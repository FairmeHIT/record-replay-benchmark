export type AppId =
  | "control-lab"
  | "tickets"
  | "storefront"
  | "code-hosting"
  | "browser-lab"
  | "content-review";

export type Difficulty = "easy" | "medium" | "hard";

export interface EvaluationCheck {
  id: string;
  label: string;
  passed: boolean;
  detail?: string;
}

export interface EvaluationResult {
  success: boolean;
  score: number;
  checks: EvaluationCheck[];
  failureReason: string | null;
}

export interface EventRecord {
  id: string;
  taskId: string;
  seed: number;
  at: string;
  type: "input" | "selection" | "workflow" | "evaluation" | "reset";
  label: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface ProfileFormState {
  kind: "profile-form";
  target: {
    name: string;
    email: string;
    country: string;
    role: string;
    budget: number;
    newsletter: boolean;
  };
  form: {
    name: string;
    email: string;
    country: string;
    role: string;
    budget: number;
    newsletter: boolean;
    accepted: boolean;
  };
  saved: boolean;
}

export interface TableApprovalState {
  kind: "table-approval";
  targetRequestId: string;
  rows: Array<{
    id: string;
    requester: string;
    department: string;
    amount: number;
    status: "pending" | "approved" | "rejected";
  }>;
  query: string;
  selectedId: string | null;
  modalOpen: boolean;
  approvalComment: string;
}

export interface TicketState {
  kind: "ticket-booking";
  target: {
    origin: string;
    destination: string;
    date: string;
    passenger: string;
    className: "Second" | "First" | "Business";
    captchaAnswer: number;
  };
  trains: Array<{
    id: string;
    depart: string;
    arrive: string;
    className: "Second" | "First" | "Business";
    price: number;
    seats: number;
  }>;
  search: {
    origin: string;
    destination: string;
    date: string;
  };
  searched: boolean;
  filter: "all" | "morning" | "afternoon";
  selectedTrainId: string | null;
  passenger: string;
  captchaInput: string;
  order: null | {
    reference: string;
    trainId: string;
    passenger: string;
    status: "reserved";
  };
}

export interface StorefrontState {
  kind: "storefront-checkout";
  target: {
    query: string;
    productId: string;
    color: string;
    size: string;
    quantity: number;
    coupon: string;
    recipient: string;
  };
  products: Array<{
    id: string;
    name: string;
    category: string;
    colors: string[];
    sizes: string[];
    price: number;
    stock: number;
  }>;
  query: string;
  searched: boolean;
  selectedProductId: string | null;
  color: string;
  size: string;
  quantity: number;
  coupon: string;
  recipient: string;
  address: string;
  cartAdded: boolean;
  orderPlaced: boolean;
}

export interface CodeHostingState {
  kind: "code-hosting";
  target: {
    issueTitle: string;
    label: string;
    assignee: string;
    branch: string;
    filePath: string;
  };
  issue: {
    title: string;
    body: string;
    label: string;
    assignee: string;
    created: boolean;
  };
  pullRequest: {
    branch: string;
    filePath: string;
    summary: string;
    opened: boolean;
    reviewed: boolean;
    checksPassed: boolean;
    merged: boolean;
  };
}

export interface BrowserLabState {
  kind: "browser-lab";
  target: {
    sampleFileName: string;
    uploadType: string;
    reportFormat: "CSV" | "PDF" | "JSON";
    approvalCode: string;
    documentId: string;
    dragOrder: string[];
    memoKeyword: string;
  };
  upload: {
    sampleDownloaded: boolean;
    fileName: string;
    documentType: string;
    parsed: boolean;
  };
  download: {
    format: "CSV" | "PDF" | "JSON";
    generated: boolean;
    fileName: string;
  };
  dialogs: {
    alertAcknowledged: boolean;
    alertOpen: boolean;
    approvalInput: string;
    promptPassed: boolean;
    promptOpen: boolean;
    confirmAccepted: boolean;
    confirmOpen: boolean;
  };
  noise: {
    cookieBannerVisible: boolean;
    helperPanelVisible: boolean;
    surveyModalVisible: boolean;
  };
  documents: Array<{
    id: string;
    title: string;
    owner: string;
    status: string;
  }>;
  documentQuery: string;
  selectedDocumentId: string | null;
  dragItems: Array<{
    id: string;
    label: string;
  }>;
  memo: string;
  submitted: boolean;
}

export interface MediaReviewState {
  kind: "media-review";
  target: {
    imageId: string;
    linkId: string;
    captionKeyword: string;
  };
  images: Array<{
    id: string;
    title: string;
    src: string;
    alt: string;
  }>;
  links: Array<{
    id: string;
    label: string;
    url: string;
    description: string;
  }>;
  selectedImageId: string | null;
  openedLinkId: string | null;
  imageApproved: boolean;
  caption: string;
  published: boolean;
  publishedPage: null | {
    id: string;
    url: string;
    imageId: string;
    imageTitle: string;
    imageSrc: string;
    imageAlt: string;
    linkId: string;
    linkLabel: string;
    linkUrl: string;
    caption: string;
    publishedAt: string;
  };
}

export type TaskState =
  | ProfileFormState
  | TableApprovalState
  | TicketState
  | StorefrontState
  | CodeHostingState
  | BrowserLabState
  | MediaReviewState;

export interface TaskDefinition {
  id: string;
  appId: AppId;
  appName: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  summary: string;
  createState: (seed: number) => TaskState;
  instruction: (state: TaskState) => string;
  evaluate: (state: TaskState) => EvaluationResult;
}
