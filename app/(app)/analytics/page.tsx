import { Metadata } from "next";
import AnalyticsContent from "./content";

export const metadata: Metadata = {
    title: "Engagement Analytics",
};

export default function AnalyticsPage() {
    return <AnalyticsContent />;
}
