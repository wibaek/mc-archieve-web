import { SessionDetailPage } from "./SessionDetailPage";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <SessionDetailPage id={params.id} />;
}
