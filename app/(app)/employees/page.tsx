import { Metadata } from "next";
import EmployeesContent from "./content";

export const metadata: Metadata = {
    title: "Invite Employees",
};

export default function EmployeesPage() {
    return <EmployeesContent />;
}
