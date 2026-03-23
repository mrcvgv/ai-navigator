import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { AI_NAVIGATOR_CONFIG as C } from "@/config/operatorConfig";

const LAST_UPDATED = "2026-03-23";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${C.siteName}, operated by ${C.operatorTradeName}.`,
  alternates: {
    canonical: `${C.siteUrl}/en/privacy`,
    languages: {
      en: `${C.siteUrl}/en/privacy`,
      ja: `${C.siteUrl}/ja/privacy`,
      "x-default": `${C.siteUrl}/en/privacy`,
    },
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout lang="en" title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p>
        {C.operatorTradeName} ("{C.siteName}") respects your privacy. This Privacy Policy
        explains what personal data we collect, how we use it, and your rights regarding
        that data. The operator of this service is {C.operatorLegalName} (trade name:{" "}
        {C.operatorTradeName}).
      </p>

      <h2>1. Personal Data We Collect</h2>
      <p>We may collect the following categories of personal data:</p>
      <ul>
        <li>
          <strong>Account data:</strong> Email address and name provided when you sign in
          via {C.authProviders.join(" or ")}.
        </li>
        <li>
          <strong>Inquiry data:</strong> Name, email address, and message content when
          you contact us.
        </li>
        <li>
          <strong>Payment data:</strong> Transaction identifiers provided by our payment
          processors ({C.paymentProcessors.join(", ")}). We do not directly store payment
          card numbers.
        </li>
        <li>
          <strong>Usage data:</strong> Pages visited, interactions, device type, and
          browser, collected through analytics services (
          {C.analyticsServices.join(", ")}).
        </li>
        <li>
          <strong>Log data:</strong> IP addresses and access timestamps stored temporarily
          by our hosting infrastructure.
        </li>
      </ul>

      <h2>2. Purposes of Use</h2>
      <p>We use collected data to:</p>
      <ul>
        <li>Provide, operate, and improve the service</li>
        <li>Respond to inquiries and provide support</li>
        <li>Process payments and prevent fraud</li>
        <li>Analyze usage patterns to improve the user experience</li>
        <li>Send service-related communications (not marketing unless you opt in)</li>
        <li>Comply with applicable laws and regulations</li>
      </ul>

      <h2>3. Legal Basis for Processing</h2>
      <p>
        We process personal data based on: your consent (where requested), performance
        of a contract (e.g., service access), compliance with legal obligations, and
        our legitimate interests in operating and improving the service.
      </p>

      <h2>4. Third-Party Services</h2>

      <h3>Payment Processing</h3>
      <p>
        Payment card transactions are handled by {C.paymentProcessors.join(", ")}. These
        services operate under their own privacy policies and PCI-DSS compliance
        frameworks. We receive only transaction identifiers and status — not card numbers.
      </p>

      <h3>Authentication</h3>
      <p>
        Sign-in via {C.authProviders.join(" / ")} is handled by those providers. We
        receive only the minimal profile data needed to create your account (email,
        display name).
      </p>

      <h3>Analytics</h3>
      <p>
        We use {C.analyticsServices.join(", ")} to understand how users interact with
        the site. These services may use cookies or similar technologies. Analytics
        data is aggregated and does not identify individual users.
      </p>

      <h2>5. Cookies and Similar Technologies</h2>
      <p>
        We use essential cookies for authentication sessions. Analytics services may set
        cookies to measure traffic. You can disable cookies in your browser settings;
        this may affect service functionality.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain personal data only as long as necessary for the purposes described
        above, or as required by law. Account data is retained while your account is
        active. Inquiry data is retained for up to 3 years. You may request deletion at
        any time (see below).
      </p>

      <h2>7. Data Sharing and Disclosure</h2>
      <p>
        We do not sell or rent personal data. We share data only with the third-party
        service providers listed above, and only to the extent necessary for service
        operation. We may disclose data if required by law or to protect our legal rights.
      </p>

      <h2>8. Your Rights</h2>
      <p>
        You have the right to request access to, correction of, or deletion of your
        personal data. To exercise these rights, contact us at{" "}
        <a href={`mailto:${C.privacyContactEmail}`} className="underline hover:text-foreground">
          {C.privacyContactEmail}
        </a>
        . We will respond within {C.supportResponseWindow}.
      </p>
      <p>
        For users in Japan, these rights are consistent with the Act on the Protection
        of Personal Information (APPI / 個人情報保護法).
      </p>

      <h2>9. Security</h2>
      <p>
        We use HTTPS encryption and access controls to protect your data. However, no
        internet transmission is completely secure. We encourage you to use a strong
        password and not share your account credentials.
      </p>

      <h2>10. Policy Updates</h2>
      <p>
        We may update this Privacy Policy. Material changes will be notified via the
        site or email. Continued use of the service after changes constitutes acceptance
        of the updated policy.
      </p>

      <h2>11. Contact</h2>
      <p>
        For privacy-related inquiries:{" "}
        <a href={`mailto:${C.privacyContactEmail}`} className="underline hover:text-foreground">
          {C.privacyContactEmail}
        </a>
      </p>
    </LegalPageLayout>
  );
}
