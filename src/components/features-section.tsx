import { CuboidIcon as Cube } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="rounded-lg bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-secondary/20">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-primary">{title}</h3>
      <p className="text-accent">{description}</p>
    </div>
  );
};

export default function FeaturesSection() {
  return (
    <div className="mt-24 grid gap-8 md:grid-cols-3">
      <FeatureCard
        title="사진 공유"
        description="여러분의 마인크래프트 사진을 다른 사용자들과 공유하세요."
        icon={<Cube className="h-6 w-6 text-accent" />}
      />
      <FeatureCard
        title="사진 저장소"
        description="여러분이 플레이한 서버의 기억을 오래동안 남기세요."
        icon={<Cube className="h-6 w-6 text-accent" />}
      />
      <FeatureCard
        title="커뮤니티 참여"
        description="마인크래프트 커뮤니티와 소통하고 함께 성장하세요."
        icon={<Cube className="h-6 w-6 text-accent" />}
      />
    </div>
  );
}
