import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CuboidIcon as Cube } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="flex items-center justify-center rounded-full bg-[#8BC34A]/20 p-4">
            <Cube className="h-12 w-12 text-[#5D4037]" />
          </div>
          <h1 className="text-5xl font-bold text-[#5D4037]">MC Archive</h1>
          <p className="max-w-md text-lg text-[#33691E]">
            여러분의 마인크래프트 스크린샷과 창작물을 커뮤니티와 공유해보세요!
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button asChild className="bg-[#795548] hover:bg-[#5D4037] px-6 py-6 text-base">
              <Link href="/login" className="flex items-center">
                로그인
              </Link>
            </Button>
            <Button asChild className="bg-[#33691E] hover:bg-[#1B5E20] px-6 py-6 text-base">
              <Link href="/register" className="flex items-center gap-2">
                회원가입
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#8BC34A]/20">
              <Cube className="h-6 w-6 text-[#33691E]" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#5D4037]">작품 공유</h3>
            <p className="text-[#33691E]">여러분의 마인크래프트 창작물을 다른 사용자들과 공유하세요.</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#8BC34A]/20">
              <Cube className="h-6 w-6 text-[#33691E]" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#5D4037]">영감 얻기</h3>
            <p className="text-[#33691E]">다른 사용자들의 창작물을 보고 새로운 아이디어를 얻으세요.</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#8BC34A]/20">
              <Cube className="h-6 w-6 text-[#33691E]" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#5D4037]">커뮤니티 참여</h3>
            <p className="text-[#33691E]">마인크래프트 커뮤니티와 소통하고 함께 성장하세요.</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-[#5D4037] mb-4">세션으로 함께하세요</h2>
          <p className="text-[#33691E] max-w-2xl mx-auto mb-8">
            세션을 만들어 다른 사용자들과 함께 활동하고, 아이디어를 공유하고, 협업할 수 있습니다.
          </p>
          <Button asChild className="bg-[#33691E] hover:bg-[#1B5E20] px-6 py-6 text-base">
            <Link href="/sessions">세션 둘러보기</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
