import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LegalTable } from "@/components/legal/LegalTable";
import { AI_NAVIGATOR_CONFIG as C } from "@/config/operatorConfig";

const LAST_UPDATED = "2026年3月23日";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "特定商取引法に基づく表記 — AI Navigator の販売業者情報",
  alternates: {
    canonical: `${C.siteUrl}/ja/legal`,
    languages: {
      en: `${C.siteUrl}/en/legal`,
      ja: `${C.siteUrl}/ja/legal`,
      "x-default": `${C.siteUrl}/en/legal`,
    },
  },
};

export default function SpecifiedCommercialTransactionsPage() {
  const rows = [
    {
      label: "販売業者（法人・個人の正式名称）",
      value: C.operatorLegalName,
      fallback: "TODO: 法律上の正式氏名または商号（必須）",
    },
    {
      label: "屋号 / ブランド名",
      value: C.operatorTradeName,
    },
    {
      label: "所在地",
      value: C.address,
      fallback: "TODO: 住所（必須）",
    },
    {
      label: "電話番号",
      value: C.phone ?? (C.disclosePhoneOnRequest
        ? "請求があり次第、遅滞なく開示いたします"
        : "TODO: 電話番号（必須）"),
    },
    {
      label: "メールアドレス",
      value: C.contactEmail,
      fallback: "TODO: メールアドレス（必須）",
    },
    {
      label: "サイト名",
      value: C.siteName,
    },
    {
      label: "サイトURL",
      value: C.siteUrl,
    },
    {
      label: "業務の種類",
      value: C.businessCategoryJa,
    },
    {
      label: "販売する商品・提供するサービス",
      value: C.serviceDescriptionJa,
    },
    {
      label: "販売価格 / 料金",
      value: C.pricingOverviewJa,
    },
    {
      label: "商品代金以外の必要料金",
      value: C.extraFeesJa,
    },
    {
      label: "支払い方法",
      value: C.paymentMethodsJa.join("\n"),
    },
    {
      label: "支払い時期",
      value: C.paymentTimingJa,
    },
    {
      label: "商品の引き渡し時期 / サービス提供時期",
      value: C.deliveryTimingJa,
    },
    {
      label: "返品・キャンセルについて",
      value: C.refundPolicyJa,
    },
    {
      label: "不良品・契約不適合時の対応",
      value: C.defectPolicyJa,
    },
    ...(C.subscriptionPolicyJa
      ? [
          {
            label: "継続課金・定期契約の条件",
            value:
              `課金サイクル：${C.subscriptionPolicyJa.billingCycle}\n` +
              `自動更新：${C.subscriptionPolicyJa.renewalCondition}\n` +
              `解約方法：${C.subscriptionPolicyJa.cancellationPolicy}` +
              (C.subscriptionPolicyJa.trialPeriod
                ? `\n無料トライアル：${C.subscriptionPolicyJa.trialPeriod}`
                : ""),
          },
        ]
      : []),
    ...(C.softwareRequirements
      ? [
          {
            label: "ソフトウェアの動作環境",
            value:
              `OS：${C.softwareRequirements.os}\n` +
              `ブラウザ：${C.softwareRequirements.browser}\n` +
              `通信環境：${C.softwareRequirements.internet}`,
          },
        ]
      : []),
    ...(C.applicationPeriodJa
      ? [{ label: "申込期間", value: C.applicationPeriodJa }]
      : []),
    ...(C.quantityLimitsJa
      ? [{ label: "販売数量・特別条件", value: C.quantityLimitsJa }]
      : []),
  ];

  return (
    <LegalPageLayout
      lang="ja"
      title="特定商取引法に基づく表記"
      lastUpdated={LAST_UPDATED}
    >
      <p>
        本ページは、特定商取引法（以下「特商法」）に基づく表記事項を掲載しています。
        当サービスの利用は、以下の記載内容および
        <a href="/ja/terms" className="underline hover:text-foreground">利用規約</a>、
        <a href="/ja/privacy" className="underline hover:text-foreground">プライバシーポリシー</a>
        に同意したものとみなします。
      </p>

      <h2>事業者情報</h2>
      <p>
        <strong>「販売業者（法人・個人の正式名称）」</strong>欄には、個人事業主の場合は
        戸籍上の氏名または商業登記簿上の商号を記載しています。
        屋号・ブランド名（{C.operatorTradeName}）は補足情報として別途記載しています。
      </p>

      <LegalTable rows={rows} />

      <h2>注記</h2>
      <ul>
        <li>
          表示価格は特段の記載がない限り消費税（10%）を含む税込価格です。
        </li>
        <li>
          クレジットカード情報は{C.paymentProcessors.join("、")}が安全に処理します。
          当事業者がカード番号を直接保有することはありません。
        </li>
        <li>
          ご購入・ご登録をもって、
          <a href="/ja/terms" className="underline hover:text-foreground">利用規約</a>および
          <a href="/ja/privacy" className="underline hover:text-foreground">プライバシーポリシー</a>
          に同意いただいたものとします。
        </li>
      </ul>
    </LegalPageLayout>
  );
}
