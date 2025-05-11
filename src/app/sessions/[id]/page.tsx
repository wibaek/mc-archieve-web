import { SessionDetailPage } from "./SessionDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "세션 상세 | MC Archieve",
  description: "MC Archieve의 세션 상세 페이지입니다.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SessionDetailPage id={id} />;
}
