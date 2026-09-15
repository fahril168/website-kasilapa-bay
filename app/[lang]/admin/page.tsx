import AdminDashboardContent from "@/components/pages/AdminDashboardContent";
import { i18n } from "@/lib/i18n";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default function AdminPage() {
  return <AdminDashboardContent />;
}
