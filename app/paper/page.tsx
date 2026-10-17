import type { Metadata } from "next";
import { NewspaperExperience } from "@/components/newspaper/NewspaperExperience";

export const metadata: Metadata = {
  title: "Today’s paper",
};

export default function PaperPage() {
  return <NewspaperExperience />;
}
