"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CuboidIcon as Cube, Menu, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function Navbar() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#8BC34A]/20">
            <Cube className="h-5 w-5 text-[#5D4037]" />
          </div>
          <span className="text-xl font-bold text-[#5D4037]">MC Archieve</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:space-x-4">
          <Link href="/" className="text-[#5D4037] hover:text-[#33691E]">
            홈
          </Link>
          <Link
            href="/sessions"
            className="text-[#5D4037] hover:text-[#33691E]"
          >
            세션
          </Link>

          {loading ? (
            <Button variant="ghost" disabled>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              로딩 중...
            </Button>
          ) : isAuthenticated ? (
            <>
              <Link
                href="/upload"
                className="text-[#5D4037] hover:text-[#33691E]"
              >
                업로드
              </Link>
              <Link
                href="/profile"
                className="text-[#5D4037] hover:text-[#33691E]"
              >
                프로필
              </Link>
              <Button
                onClick={logout}
                variant="outline"
                className="border-gray-200 text-[#5D4037] hover:bg-[#795548] hover:text-white"
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="bg-[#795548] hover:bg-[#5D4037]">
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild className="bg-[#33691E] hover:bg-[#1B5E20]">
                <Link href="/register">회원가입</Link>
              </Button>
            </>
          )}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden border-gray-200"
            >
              <Menu className="h-5 w-5 text-[#5D4037]" />
              <span className="sr-only">메뉴 토글</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white">
            <div className="flex flex-col space-y-4 mt-8">
              <Link href="/" className="text-[#5D4037] hover:text-[#33691E]">
                홈
              </Link>
              <Link
                href="/sessions"
                className="text-[#5D4037] hover:text-[#33691E]"
              >
                세션
              </Link>

              {loading ? (
                <Button variant="ghost" disabled className="justify-start">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  로딩 중...
                </Button>
              ) : isAuthenticated ? (
                <>
                  <Link
                    href="/upload"
                    className="text-[#5D4037] hover:text-[#33691E]"
                  >
                    업로드
                  </Link>
                  <Link
                    href="/profile"
                    className="text-[#5D4037] hover:text-[#33691E]"
                  >
                    프로필
                  </Link>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="border-gray-200 text-[#5D4037] hover:bg-[#795548] hover:text-white justify-start"
                  >
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    className="bg-[#795548] hover:bg-[#5D4037] justify-start"
                  >
                    <Link href="/login">로그인</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-[#33691E] hover:bg-[#1B5E20] justify-start"
                  >
                    <Link href="/register">회원가입</Link>
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
