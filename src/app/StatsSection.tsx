"use client";
import { Users, BookOpen, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getStats } from "@/services/stat";
import { Stats } from "@/types/stat";
import { Loading } from "@/components/Loading";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2초 동안 애니메이션
    const steps = 60; // 프레임 수
    const stepDuration = duration / steps;
    const increment = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep === steps) {
        setCurrentValue(value);
        clearInterval(timer);
      } else {
        setCurrentValue(Math.round(increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <div className={`mb-4 p-3 rounded-full ${color}`}>{icon}</div>
      <h3 className="text-3xl font-bold text-primary mb-2">
        {currentValue.toLocaleString()}
      </h3>
      <p className="text-accent">{title}</p>
    </div>
  );
};

export default function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStats();
        if ("error" in response) {
          setError(response.error as string);
        } else {
          setStats(response as Stats);
        }
      } catch (err) {
        setError("통계 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="py-12 bg-page">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-page">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            커뮤니티 현황
          </h2>
          <p className="text-accent max-w-2xl mx-auto">
            MC Archieve는 지속적으로 성장하는 커뮤니티입니다.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            title="활성 세션"
            value={stats?.sessionCount || 0}
            icon={<BookOpen className="h-8 w-8 text-secondary" />}
            color="bg-secondary/10"
          />
          <StatCard
            title="스토리"
            value={stats?.storyCount || 0}
            icon={<Users2 className="h-8 w-8 text-accent" />}
            color="bg-accent/10"
          />
          <StatCard
            title="활성 유저"
            value={stats?.userCount || 0}
            icon={<Users className="h-8 w-8 text-primary" />}
            color="bg-primary/10"
          />
        </div>
      </div>
    </div>
  );
}
