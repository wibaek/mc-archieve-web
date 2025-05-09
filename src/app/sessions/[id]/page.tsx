import { SessionDetailPage } from "./SessionDetailPage";
import { Metadata } from "next";

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "세션 상세 | MC Archieve",
  description: "MC Archieve의 세션 상세 페이지입니다.",
};

export default function Page({ params }: PageProps) {
  return <SessionDetailPage id={params.id} />;
}
