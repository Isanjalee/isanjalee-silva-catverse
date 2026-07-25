import type { Metadata } from "next";
import IsanjaleeViewportGate from "@/components/IsanjaleeViewportGate";

export const metadata: Metadata = {
  title: "Private Signal Vault",
  description:
    "A private digital signal vault for Isanjalee Silva's identity layer.",
  alternates: {
    canonical: "/isanjalee",
  },
};

export default function IsanjaleeVaultPage() {
  return <IsanjaleeViewportGate />;
}
