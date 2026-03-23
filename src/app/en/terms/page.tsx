import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { AI_NAVIGATOR_CONFIG as C } from "@/config/operatorConfig";

const LAST_UPDATED = "2026-03-23";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${C.siteName}.`,
  alternates: {
    canonical: `${C.siteUrl}/en/terms`,
    languages: {
      en: `${C.siteUrl}/en/terms`,
      ja: `${C.siteUrl}/ja/terms`,
      "x-default": `${C.siteUrl}/en/terms`,
    },
  },
};

export default function TermsPage() {
  return (
    <LegalPageLayout lang="en" title="Terms of Service" lastUpdated={LAST_UPDATED}>
      <p>
        These Terms of Service ("Terms") govern your use of {C.siteName} and all
        related services operated by {C.operatorLegalName} (trade name:{" "}
        {C.operatorTradeName}). By accessing or using the service, you agree to these
        Terms.
      </p>

      <h2>1. Service Description</h2>
      <p>{C.serviceDescription}</p>
      <p>
        The operator reserves the right to modify, add, or discontinue any features of
        the service at any time. Material changes will be communicated in advance where
        reasonably practicable.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 13 years old to use this service. If you are under 18,
        you must have parental or guardian consent. By using the service, you represent
        that you meet these requirements.
      </p>

      <h2>3. Account Registration</h2>
      <p>
        Some features require account registration. You are responsible for maintaining
        the confidentiality of your credentials and for all activity under your account.
        Notify us immediately at{" "}
        <a href={`mailto:${C.contactEmail}`} className="underline hover:text-foreground">
          {C.contactEmail}
        </a>{" "}
        if you suspect unauthorized access.
      </p>
      <p>
        Accounts may not be transferred, sold, or shared. We reserve the right to
        suspend or terminate accounts that violate these Terms.
      </p>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the service for any unlawful purpose or in violation of applicable laws</li>
        <li>
          Reproduce, redistribute, resell, or commercially exploit service content
          without prior written permission
        </li>
        <li>
          Attempt to reverse-engineer, scrape, crawl, or systematically extract data
          from the service beyond normal browsing
        </li>
        <li>
          Upload or transmit malware, spam, or any content that is harmful, defamatory,
          or infringing
        </li>
        <li>
          Impersonate any person or entity, or falsely represent your affiliation
        </li>
        <li>
          Interfere with or disrupt the service infrastructure
        </li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>
        All content, design, code, trademarks, and other materials on {C.siteName} are
        owned by or licensed to {C.copyrightOwner} unless otherwise indicated.
      </p>
      <p>
        You are granted a limited, non-exclusive, non-transferable license to access
        and use the service for personal, non-commercial purposes only. Nothing in these
        Terms transfers ownership of any intellectual property to you.
      </p>
      <p>
        Third-party trademarks and product names referenced on this site belong to their
        respective owners. Their appearance does not imply endorsement or affiliation.
      </p>

      <h2>6. Third-Party Information</h2>
      <p>
        {C.siteName} provides information about third-party AI tools and services for
        informational purposes. We do not endorse, guarantee, or take responsibility for
        the accuracy, pricing, or availability of third-party products. Users should
        verify information directly with the relevant providers before making decisions.
      </p>

      <h2>7. Payments and Subscriptions</h2>
      <p>
        Pricing for paid features is listed at the time of purchase. Payment is processed
        by {C.paymentProcessors.join(", ")}. Refund and cancellation terms are described
        in our{" "}
        <a href="/en/legal" className="underline hover:text-foreground">
          Legal Disclosure
        </a>
        .
      </p>
      {C.subscriptionPolicy && (
        <p>
          Subscriptions renew automatically on the billing cycle stated at purchase.
          You may cancel at any time through your account settings or by contacting
          support. Cancellation takes effect at the end of the current billing period.
        </p>
      )}

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        The service is provided "as is" and "as available" without warranties of any
        kind, express or implied, including but not limited to merchantability, fitness
        for a particular purpose, or non-infringement.
      </p>
      <p>
        We do not warrant that the service will be uninterrupted, error-free, or that
        any defects will be corrected. You use the service at your own risk.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, the operator shall not be
        liable for any indirect, incidental, special, consequential, or punitive damages
        arising from your use of or inability to use the service, even if advised of the
        possibility of such damages.
      </p>
      <p>
        The operator's total liability for any claim arising from these Terms shall not
        exceed the amount you paid to us in the 12 months preceding the claim, or ¥1,000
        if no payment was made.
      </p>

      <h2>10. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless the operator and its affiliates from any
        claims, damages, or expenses arising from your use of the service or violation of
        these Terms.
      </p>

      <h2>11. Service Changes and Termination</h2>
      <p>
        We reserve the right to modify or discontinue the service, in whole or in part,
        at any time. We will provide reasonable notice of material changes. We may
        suspend or terminate your access for violations of these Terms.
      </p>

      <h2>12. Privacy</h2>
      <p>
        Your use of the service is also governed by our{" "}
        <a href="/en/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </a>
        , which is incorporated into these Terms by reference.
      </p>

      <h2>13. Governing Law and Jurisdiction</h2>
      <p>
        These Terms are governed by the {C.governingLaw}. Any disputes arising from or
        related to these Terms shall be subject to the exclusive jurisdiction of the{" "}
        {C.court} as the court of first instance.
      </p>

      <h2>14. Amendments</h2>
      <p>
        We may update these Terms at any time. Updated Terms will be posted on this page
        with a revised effective date. Continued use of the service after the effective
        date constitutes your acceptance of the updated Terms.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about these Terms:{" "}
        <a href={`mailto:${C.contactEmail}`} className="underline hover:text-foreground">
          {C.contactEmail}
        </a>
      </p>
    </LegalPageLayout>
  );
}
