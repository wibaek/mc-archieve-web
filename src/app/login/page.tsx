import { LoginForm } from "./LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | MC Archieve",
  description: "MC Archieve에 로그인하여 서비스를 이용해보세요.",
};

export default function LoginPage() {
  return <LoginForm />;
}
