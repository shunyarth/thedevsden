import { getServicePage } from "@/data/servicePages";
import { ServicePageView, serviceMetadata } from "@/components/ServicePageView";

const page = getServicePage("website-development");

export const metadata = serviceMetadata(page);

export default function Page() {
  return <ServicePageView page={page} />;
}
