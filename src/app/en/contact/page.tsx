import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { AI_NAVIGATOR_CONFIG as C } from "@/config/operatorConfig";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${C.siteName} — operated by ${C.operatorTradeName}.`,
  alternates: {
    canonical: `${C.siteUrl}/en/contact`,
    languages: {
      en: `${C.siteUrl}/en/contact`,
      ja: `${C.siteUrl}/ja/contact`,
      "x-default": `${C.siteUrl}/en/contact`,
    },
  },
};

export default function ContactPage() {
  return (
    <LegalPageLayout lang="en" title="Contact" lastUpdated="2026-03-23">
      <p>
        For inquiries about {C.siteName}, service support, legal notices, or privacy
        requests, please reach out via the email address below.
      </p>

      <h2>Contact Email</h2>
      <p>
        <a
          href={`mailto:${C.contactEmail}`}
          className="font-medium underline hover:text-foreground"
        >
          {C.contactEmail}
        </a>
      </p>

      <h2>Response Time</h2>
      <p>
        We aim to respond to all inquiries within{" "}
        <strong>{C.supportResponseWindow}</strong>. Response times may be longer during
        public holidays in Japan.
      </p>

      <h2>Inquiry Types</h2>
      <ul>
        <li>General questions about the service</li>
        <li>Technical support or access issues</li>
        <li>Billing and subscription inquiries</li>
        <li>Legal notices (operator information requests per Specified Commercial Transactions Act)</li>
        <li>Privacy requests (access, correction, or deletion of personal data)</li>
        <li>Reporting inaccurate tool information</li>
      </ul>

      <h2>Operator</h2>
      <p>
        <strong>Legal operator:</strong> {C.operatorLegalName}
        <br />
        <strong>Trade name:</strong> {C.operatorTradeName}
      </p>

      {C.address && (
        <p>
          <strong>Address:</strong> {C.address}
        </p>
      )}

      {!C.phone && C.disclosePhoneOnRequest && (
        <p>
          <strong>Phone:</strong> Available without delay upon written request.
        </p>
      )}
      {C.phone && (
        <p>
          <strong>Phone:</strong> {C.phone}
        </p>
      )}
    </LegalPageLayout>
  );
}
