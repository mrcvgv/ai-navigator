import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { AI_NAVIGATOR_CONFIG as C } from "@/config/operatorConfig";

const LAST_UPDATED = "2026年3月23日";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${C.siteName} のプライバシーポリシー（個人情報保護方針）`,
  alternates: {
    canonical: `${C.siteUrl}/ja/privacy`,
    languages: {
      en: `${C.siteUrl}/en/privacy`,
      ja: `${C.siteUrl}/ja/privacy`,
      "x-default": `${C.siteUrl}/en/privacy`,
    },
  },
};

export default function PrivacyPolicyJaPage() {
  return (
    <LegalPageLayout lang="ja" title="プライバシーポリシー" lastUpdated={LAST_UPDATED}>
      <p>
        {C.operatorTradeName}（運営者：{C.operatorLegalName}、以下「当事業者」）は、
        {C.siteName}（以下「本サービス」）のご利用にあたり、お客様の個人情報を適切に取り扱います。
        本ポリシーは、個人情報の保護に関する法律（個人情報保護法）に基づき策定しています。
      </p>

      <h2>1. 取得する個人情報</h2>
      <p>当事業者は、以下の情報を取得する場合があります。</p>
      <ul>
        <li>
          <strong>アカウント情報：</strong>
          {C.authProviders.join("・")}を利用してサインインした際に取得する
          メールアドレス・表示名。
        </li>
        <li>
          <strong>お問い合わせ情報：</strong>
          お問い合わせフォームまたはメールで送付いただいた、氏名・メールアドレス・内容。
        </li>
        <li>
          <strong>決済情報：</strong>
          決済代行サービス（{C.paymentProcessors.join("、")}）が処理する取引識別子。
          当事業者がカード番号を直接保持することはありません。
        </li>
        <li>
          <strong>利用状況情報：</strong>
          アクセス解析サービス（{C.analyticsServices.join("、")}）を通じて取得する、
          閲覧ページ・操作履歴・デバイス種別・ブラウザ情報。
        </li>
        <li>
          <strong>ログ情報：</strong>
          ホスティング環境が一時的に記録するIPアドレス・アクセス日時。
        </li>
      </ul>

      <h2>2. 利用目的</h2>
      <ul>
        <li>本サービスの提供・運営・改善</li>
        <li>お問い合わせへの回答・サポートの提供</li>
        <li>決済処理・不正利用の防止</li>
        <li>利用状況の分析によるユーザー体験の向上</li>
        <li>サービスに関する重要なご連絡（マーケティング目的には使用しません）</li>
        <li>法令上の義務への対応</li>
      </ul>

      <h2>3. 第三者提供</h2>
      <p>
        当事業者は、以下の場合を除き、お客様の個人情報を第三者に提供しません。
      </p>
      <ul>
        <li>お客様の同意がある場合</li>
        <li>法令に基づく場合</li>
        <li>本サービスの運営に必要な委託先（後述の外部サービス）への提供</li>
        <li>当事業者の権利・財産を保護するために必要な場合</li>
      </ul>

      <h2>4. 外部サービスの利用</h2>

      <h3>決済処理</h3>
      <p>
        クレジットカード等の決済は{C.paymentProcessors.join("、")}が処理します。
        これらのサービスは各社のプライバシーポリシーおよびPCI-DSS基準に基づき運営されています。
        当事業者が受け取るのは取引識別子のみであり、カード番号は保持しません。
      </p>

      <h3>認証サービス</h3>
      <p>
        {C.authProviders.join("・")}を通じたサインインは各プロバイダーが処理します。
        当事業者はアカウント作成に最低限必要な情報（メールアドレス・表示名）のみ受け取ります。
      </p>

      <h3>アクセス解析</h3>
      <p>
        {C.analyticsServices.join("、")}を使用してサービスの利用状況を把握しています。
        取得データは集計・統計化されており、個人を特定するものではありません。
      </p>

      <h2>5. Cookieおよび類似技術</h2>
      <p>
        認証セッションの維持に必要なCookieを使用しています。
        解析サービスがトラフィック計測のためにCookieを設定する場合があります。
        ブラウザの設定でCookieを無効にすることができますが、一部の機能が利用できなくなる場合があります。
      </p>

      <h2>6. 保存期間</h2>
      <p>
        個人情報は利用目的の達成に必要な期間、または法令で定められた期間にのみ保存します。
        アカウント情報はアカウントが有効な間保存します。
        お問い合わせ情報は最大3年間保存します。
        削除のご希望はいつでも受け付けます（下記7項参照）。
      </p>

      <h2>7. 開示・訂正・削除の請求</h2>
      <p>
        お客様は、ご自身の個人情報の開示・訂正・削除を請求する権利を有します。
        ご請求は下記の連絡先までお申し出ください。
        本人確認の上、{C.supportResponseWindowJa}以内に対応いたします。
      </p>
      <p>
        連絡先：
        <a href={`mailto:${C.privacyContactEmail}`} className="underline hover:text-foreground">
          {C.privacyContactEmail}
        </a>
      </p>

      <h2>8. セキュリティ</h2>
      <p>
        HTTPS暗号化とアクセス制御により個人情報を保護しています。
        ただし、インターネット上での完全な安全性は保証できません。
        アカウントのパスワードは他人と共有しないようにしてください。
      </p>

      <h2>9. ポリシーの変更</h2>
      <p>
        本ポリシーは予告なく変更する場合があります。
        重要な変更が生じた場合はサイト上またはメールでお知らせします。
        変更後も継続してサービスをご利用の場合は、変更後のポリシーに同意したものとみなします。
      </p>

      <h2>10. お問い合わせ</h2>
      <p>
        個人情報に関するお問い合わせ：
        <a href={`mailto:${C.privacyContactEmail}`} className="underline hover:text-foreground">
          {C.privacyContactEmail}
        </a>
      </p>
    </LegalPageLayout>
  );
}
