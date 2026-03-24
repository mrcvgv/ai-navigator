import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LegalTable } from "@/components/legal/LegalTable";
import { AI_NAVIGATOR_CONFIG as C } from "@/config/operatorConfig";

const LAST_UPDATED = "2026-03-23";

export const metadata: Metadata = {
  title: "Legal Disclosure (Specified Commercial Transactions Act)",
  description: "Legal disclosure notice based on Japan's Specified Commercial Transactions Act.",
  alternates: {
    canonical: `${C.siteUrl}/legal/disclosure`,
  },
};

export default function LegalDisclosurePage() {
  const rows = [
    {
      label: "Legal Operator Name",
      value: C.operatorLegalName,
      fallback: "TODO: Legal Name Required",
    },
    {
      label: "Trade Name / Brand",
      value: C.operatorTradeName,
    },
    {
      label: "Address",
      value: C.address,
      fallback: "TODO: Address Required",
    },
    {
      label: "Phone",
      value: C.phone ?? (C.disclosePhoneOnRequest
        ? "Available without delay upon written request"
        : "TODO: Phone Required"),
    },
    {
      label: "Email",
      value: C.contactEmail,
      fallback: "TODO: Email Required",
    },
    {
      label: "Site Name",
      value: C.siteName,
    },
    {
      label: "Site URL",
      value: C.siteUrl,
    },
    {
      label: "Business Category",
      value: C.businessCategory,
    },
    {
      label: "Service / Product",
      value: C.serviceDescription,
    },
    {
      label: "Pricing",
      value: C.pricingOverview,
    },
    {
      label: "Additional Fees",
      value: C.extraFees,
    },
    {
      label: "Payment Methods",
      value: C.paymentMethods.join("\n"),
    },
    {
      label: "Payment Timing",
      value: C.paymentTiming,
    },
    {
      label: "Delivery / Fulfillment",
      value: C.deliveryTiming,
    },
    {
      label: "Returns / Cancellation",
      value: C.refundPolicy,
    },
    {
      label: "Defect / Non-conformity",
      value: C.defectPolicy,
    },
    ...(C.subscriptionPolicy
      ? [
          {
            label: "Subscription Billing",
            value:
              `Cycle: ${C.subscriptionPolicy.billingCycle}\n` +
              `Renewal: ${C.subscriptionPolicy.renewalCondition}\n` +
              `Cancellation: ${C.subscriptionPolicy.cancellationPolicy}` +
              (C.subscriptionPolicy.trialPeriod
                ? `\nTrial: ${C.subscriptionPolicy.trialPeriod}`
                : ""),
          },
        ]
      : []),
    ...(C.softwareRequirements
      ? [
          {
            label: "Software Requirements",
            value:
              `OS: ${C.softwareRequirements.os}\n` +
              `Browser: ${C.softwareRequirements.browser}\n` +
              `Network: ${C.softwareRequirements.internet}`,
          },
        ]
      : []),
    ...(C.applicationPeriod
      ? [{ label: "Application Period", value: C.applicationPeriod }]
      : []),
    ...(C.quantityLimits
      ? [{ label: "Quantity Limits", value: C.quantityLimits }]
      : []),
  ];

  return (
    <LegalPageLayout title="Legal Disclosure" lastUpdated={LAST_UPDATED}>
      <p>
        This page provides legal disclosures required under Japan's Act on Specified
        Commercial Transactions (特定商取引法). All service transactions are subject to
        the terms and policies described below.
      </p>

      <h2>Operator Information</h2>
      <p>
        The following information identifies the legal entity responsible for operating
        this service. The <strong>Legal Operator Name</strong> is the operator's legally
        registered name (individual or corporate). The <strong>Trade Name</strong> is the
        commercial brand used on this site.
      </p>

      <LegalTable rows={rows} />

      <h2>Notes</h2>
      <ul>
        <li>
          All prices shown on this site include Japanese consumption tax (10%) unless
          otherwise stated.
        </li>
        <li>
          Payment card information is processed securely by{" "}
          {C.paymentProcessors.join(", ")}. The operator does not directly store card
          numbers.
        </li>
        <li>
          By completing a purchase or subscription, you agree to the{" "}
          <a href="/legal/terms" className="underline hover:text-foreground">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/legal/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </a>
          .
        </li>
      </ul>
    </LegalPageLayout>
  );
}
