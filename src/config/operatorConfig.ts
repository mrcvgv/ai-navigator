// ============================================================
// Operator & Site Configuration
// ============================================================
//
// CRITICAL LEGAL NOTE (特商法):
//   operatorLegalName must be the operator's real registered name
//   (個人事業主なら戸籍上の氏名 / 法人なら登記商号).
//   A trade name, brand name, or site name alone is NOT sufficient
//   under Japan's Specified Commercial Transactions Act.
//
// This config is the single source of truth for all legal pages.
// Import and use it in /en/* and /ja/* route pages.
// ============================================================

export interface SubscriptionPolicy {
  billingCycle: string;          // "Monthly" / "毎月"
  renewalCondition: string;      // How auto-renewal works
  cancellationPolicy: string;    // How to cancel + effective timing
  trialPeriod?: string;          // Free trial details if any
}

export interface PhysicalShippingPolicy {
  carrier: string;
  estimatedDays: string;
  shippingFee: string;
  regions: string;
}

export interface SoftwareRequirements {
  os: string;
  browser: string;
  internet: string;
  other?: string;
}

export interface OperatorConfig {
  // ── Legal Identity (特商法 primary field) ──────────────────
  /** Operator's legal registered name. Individual: real name. Corp: registered company name. */
  operatorLegalName: string;
  /** Brand / trade name displayed publicly. Separate from legal name. */
  operatorTradeName: string;

  // ── Address & Contact ─────────────────────────────────────
  /** Full address. Can be abbreviated to region if needed, but full is stronger for Stripe. */
  address: string;
  /**
   * Phone number.
   * If null and disclosePhoneOnRequest is true, shows
   * "Available without delay upon request" / "請求により遅滞なく開示します"
   */
  phone: string | null;
  disclosePhoneOnRequest: boolean;
  /** Primary contact email for legal/commercial inquiries. */
  contactEmail: string;

  // ── Site Identity ─────────────────────────────────────────
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  defaultLocale: "en" | "ja";
  supportedLocales: ("en" | "ja")[];

  // ── Business ──────────────────────────────────────────────
  /**
   * Business category for 特商法.
   * e.g. "Information services / AI navigation tools"
   *      "情報提供サービス / AIナビゲーションツール"
   */
  businessCategory: string;
  businessCategoryJa: string;
  /** What is sold/provided — short description */
  serviceDescription: string;
  serviceDescriptionJa: string;

  // ── Pricing & Payment ─────────────────────────────────────
  /** Pricing overview. e.g. "Free plan available; paid plans from ¥XXX/month" */
  pricingOverview: string;
  pricingOverviewJa: string;
  /** Any additional fees beyond listed price. e.g. "None" or "Consumption tax included" */
  extraFees: string;
  extraFeesJa: string;
  paymentMethods: string[];          // ["Credit card (Visa, Mastercard, etc.)", "PayPay", ...]
  paymentMethodsJa: string[];
  /** When payment is charged. e.g. "At time of purchase" */
  paymentTiming: string;
  paymentTimingJa: string;
  /** When service/product is delivered. e.g. "Immediately upon payment" */
  deliveryTiming: string;
  deliveryTimingJa: string;

  // ── Policies ─────────────────────────────────────────────
  refundPolicy: string;
  refundPolicyJa: string;
  /** Handling for defective or non-conforming goods/services */
  defectPolicy: string;
  defectPolicyJa: string;

  // ── Conditional fields ───────────────────────────────────
  /** Null if no subscription offering */
  subscriptionPolicy: SubscriptionPolicy | null;
  subscriptionPolicyJa: {
    billingCycle: string;
    renewalCondition: string;
    cancellationPolicy: string;
    trialPeriod?: string;
  } | null;
  /** Null if no physical goods */
  shippingPolicy: PhysicalShippingPolicy | null;
  shippingPolicyJa: PhysicalShippingPolicy | null;
  /** Null if not a software/SaaS product */
  softwareRequirements: SoftwareRequirements | null;
  /** Null if no application deadline */
  applicationPeriod: string | null;
  applicationPeriodJa: string | null;
  /** Null if no quantity limits */
  quantityLimits: string | null;
  quantityLimitsJa: string | null;

  // ── Legal Jurisdiction ───────────────────────────────────
  country: string;           // "Japan"
  jurisdiction: string;      // "Tokyo, Japan"
  governingLaw: string;      // "Laws of Japan"
  governingLawJa: string;    // "日本法"
  court: string;             // "Tokyo District Court"
  courtJa: string;           // "東京地方裁判所"

  // ── IP & Copyright ───────────────────────────────────────
  copyrightOwner: string;
  trademarkNotice: string | null;

  // ── Support ──────────────────────────────────────────────
  /** e.g. "Within 3 business days" */
  supportResponseWindow: string;
  supportResponseWindowJa: string;

  // ── Privacy ──────────────────────────────────────────────
  privacyContactEmail: string;
  analyticsServices: string[];    // e.g. ["Vercel Analytics", "Google Analytics"]
  paymentProcessors: string[];    // e.g. ["Stripe"]
  authProviders: string[];        // e.g. ["Google", "GitHub"]
}

// ============================================================
// AI Navigator — Site Configuration
// ============================================================
// Replace all TODO values before going live.
// ============================================================
export const AI_NAVIGATOR_CONFIG: OperatorConfig = {
  // ── Legal Identity ────────────────────────────────────────
  operatorLegalName: "TODO: [Your Legal Full Name]",         // 本名（個人事業主の場合）
  operatorTradeName: "Cream",                                 // ブランド名

  // ── Address & Contact ─────────────────────────────────────
  address: "",
  phone: null,
  disclosePhoneOnRequest: true,
  contactEmail: "TODO: contact@example.com",

  // ── Site Identity ─────────────────────────────────────────
  siteName: "AI Navigator",
  siteDescription: "Compare AI tools side-by-side. Find the right tool with confidence.",
  siteUrl: "https://ai-navigator.example.com",   // TODO: real URL
  defaultLocale: "en",
  supportedLocales: ["en"],

  // ── Business ──────────────────────────────────────────────
  businessCategory: "Information services / AI tool navigation",
  businessCategoryJa: "情報提供サービス / AIツールナビゲーション",
  serviceDescription:
    "AI Navigator provides an information and comparison service for AI software tools. " +
    "Users can compare pricing, features, and scores of AI tools at no charge. " +
    "Premium features (if any) are described at the time of purchase.",
  serviceDescriptionJa:
    "AI Navigatorは、AIソフトウェアツールの情報提供・比較サービスです。" +
    "ユーザーはAIツールの価格・機能・スコアを無料で比較できます。" +
    "プレミアム機能がある場合は、購入時に内容を明示します。",

  // ── Pricing & Payment ─────────────────────────────────────
  pricingOverview: "Basic browsing and comparison is free. Premium plans (if offered) are listed on the pricing page.",
  pricingOverviewJa: "基本的な閲覧・比較機能は無料です。プレミアムプランがある場合は、料金ページに掲載します。",
  extraFees: "None. All listed prices include applicable consumption tax.",
  extraFeesJa: "なし。表示価格はすべて消費税込みです。",
  paymentMethods: ["Credit/debit card (Visa, Mastercard, American Express)", "Apple Pay", "Google Pay"],
  paymentMethodsJa: ["クレジット・デビットカード（Visa、Mastercard、American Express）", "Apple Pay", "Google Pay"],
  paymentTiming: "Charged at the time of purchase or subscription activation.",
  paymentTimingJa: "購入時またはサブスクリプション開始時に課金されます。",
  deliveryTiming: "Digital services are accessible immediately upon successful payment.",
  deliveryTimingJa: "デジタルサービスは、決済完了後すぐにご利用いただけます。",

  // ── Policies ─────────────────────────────────────────────
  refundPolicy:
    "Due to the nature of digital services, refunds are generally not available after access is granted. " +
    "If you experience a service defect or access failure, please contact us within 7 days of purchase. " +
    "We will investigate and, if the issue is on our side, provide a remedy or refund.",
  refundPolicyJa:
    "デジタルサービスの性質上、アクセス付与後の返金は原則として承っておりません。" +
    "サービスの不具合やアクセス障害が生じた場合は、購入から7日以内にご連絡ください。" +
    "弊社起因の問題と確認できた場合は、適切な対応または返金を行います。",
  defectPolicy:
    "We strive to provide accurate and up-to-date information. " +
    "If you find material errors or defects, please notify us and we will correct them promptly.",
  defectPolicyJa:
    "正確かつ最新の情報提供に努めています。" +
    "重大な誤りや不具合を発見された場合は、ご連絡いただければ速やかに修正します。",

  // ── Subscription ─────────────────────────────────────────
  subscriptionPolicy: null,  // Set when subscription plans are launched
  subscriptionPolicyJa: null,

  // ── No physical goods ────────────────────────────────────
  shippingPolicy: null,
  shippingPolicyJa: null,

  // ── Software / SaaS ──────────────────────────────────────
  softwareRequirements: {
    os: "Windows 10+, macOS 12+, iOS 15+, Android 10+ (or equivalent)",
    browser: "Latest version of Chrome, Firefox, Safari, or Edge",
    internet: "Internet connection required",
  },

  // ── Conditionals ─────────────────────────────────────────
  applicationPeriod: null,
  applicationPeriodJa: null,
  quantityLimits: null,
  quantityLimitsJa: null,

  // ── Legal Jurisdiction ───────────────────────────────────
  country: "Japan",
  jurisdiction: "Tokyo, Japan",
  governingLaw: "Laws of Japan",
  governingLawJa: "日本法",
  court: "Tokyo District Court",
  courtJa: "東京地方裁判所",

  // ── IP & Copyright ───────────────────────────────────────
  copyrightOwner: "Cream (TODO: [Legal Name])",
  trademarkNotice: null,

  // ── Support ──────────────────────────────────────────────
  supportResponseWindow: "Within 3 business days",
  supportResponseWindowJa: "3営業日以内",

  // ── Privacy ──────────────────────────────────────────────
  privacyContactEmail: "TODO: privacy@example.com",
  analyticsServices: ["Vercel Analytics"],
  paymentProcessors: ["Stripe"],
  authProviders: [],
} as const satisfies OperatorConfig;
