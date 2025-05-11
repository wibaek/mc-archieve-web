import { Button } from "@/components/ui/button";
import StatsSection from "@/app/StatsSection";
import FeaturesSection from "@/components/features-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-page">
      <div className="container mx-auto px-4 py-24 space-y-32">
        {/* Hero Section */}
        <div className="relative text-center max-w-3xl mx-auto">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white/5 rounded-full blur-3xl" />
          <h1 className="mb-6 text-5xl font-bold text-primary md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            마인크래프트 아카이브
          </h1>
          <p className="mb-10 text-lg text-accent/90 md:text-xl max-w-2xl mx-auto">
            여러분의 마인크래프트 서버 추억을 공유하고 기록하세요
          </p>
          <Button
            size="lg"
            asChild
            className="px-8 py-6 text-lg font-medium rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-primary/25"
          >
            <a href="/sessions">시작하기</a>
          </Button>
        </div>

        {/* Features Section */}
        <div className="space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="mb-4 text-4xl font-bold text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              주요 기능
            </h2>
            <p className="text-accent/90 text-lg">
              마인크래프트 아카이브가 제공하는 다양한 기능을 살펴보세요
            </p>
          </div>

          <FeaturesSection />
        </div>

        <StatsSection />
      </div>
    </div>
  );
}
