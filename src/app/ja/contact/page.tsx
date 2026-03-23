import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { AI_NAVIGATOR_CONFIG as C } from "@/config/operatorConfig";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: `${C.siteName} へのお問い合わせ`,
  alternates: {
    canonical: `${C.siteUrl}/ja/contact`,
    languages: {
      en: `${C.siteUrl}/en/contact`,
      ja: `${C.siteUrl}/ja/contact`,
      "x-default": `${C.siteUrl}/en/contact`,
    },
  },
};

export default function ContactJaPage() {
  return (
    <LegalPageLayout lang="ja" title="お問い合わせ" lastUpdated="2026年3月23日">
      <p>
        {C.siteName}に関するご質問・サポートのご依頼・法的なお問い合わせ・
        個人情報に関するご請求は、下記メールアドレスまでご連絡ください。
      </p>

      <h2>メールアドレス</h2>
      <p>
        <a
          href={`mailto:${C.contactEmail}`}
          className="font-medium underline hover:text-foreground"
        >
          {C.contactEmail}
        </a>
      </p>

      <h2>回答までの目安</h2>
      <p>
        いただいたお問い合わせには、<strong>{C.supportResponseWindowJa}</strong>
        以内を目安に回答いたします。
        日本の祝日等はご回答が遅れる場合があります。
      </p>

      <h2>受付内容</h2>
      <ul>
        <li>サービスに関する一般的なご質問</li>
        <li>技術的なサポート・アクセスの不具合</li>
        <li>料金・サブスクリプションに関するお問い合わせ</li>
        <li>特定商取引法に基づく情報開示請求（電話番号等）</li>
        <li>個人情報の開示・訂正・削除のご請求</li>
        <li>掲載情報の誤りに関するご報告</li>
      </ul>

      <h2>運営者情報</h2>
      <p>
        <strong>販売業者（正式名称）：</strong>{C.operatorLegalName}
        <br />
        <strong>屋号 / ブランド名：</strong>{C.operatorTradeName}
      </p>

      {C.address && (
        <p>
          <strong>所在地：</strong>{C.address}
        </p>
      )}

      {!C.phone && C.disclosePhoneOnRequest && (
        <p>
          <strong>電話番号：</strong>
          請求があり次第、遅滞なく開示いたします。上記メールアドレスよりご連絡ください。
        </p>
      )}
      {C.phone && (
        <p>
          <strong>電話番号：</strong>{C.phone}
        </p>
      )}
    </LegalPageLayout>
  );
}
