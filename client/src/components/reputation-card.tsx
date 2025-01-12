import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Star, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ReputationResponse {
  reputation: number;
  level: number;
  recentEvents: {
    amount: number;
    reason: string;
    timestamp: string;
  }[];
}

interface Achievement {
  achievement: {
    title: string;
    description: string;
    icon: string;
  };
  unlockedAt: string;
}

export default function ReputationCard({ userId }: { userId: number }) {
  const { data: reputationData } = useQuery<ReputationResponse>({
    queryKey: [`/api/user/reputation/${userId}`],
  });

  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: [`/api/user/achievements/${userId}`],
  });

  // Calculate level progress
  const currentLevelRep = ((reputationData?.level || 1) -1) * 1000;
  const nextLevelRep = (reputationData?.level || 1) * 1000;
  const progress = Math.min(100, Math.max(0, ((reputationData?.reputation || 0) - currentLevelRep) / (nextLevelRep - currentLevelRep) * 100));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Reputation & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reputation Score */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Total Reputation</p>
            <p className="text-2xl font-bold">{reputationData?.reputation || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Level</p>
            <p className="text-2xl font-bold">{reputationData?.level || 1}</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {(reputationData?.level || 1) + 1}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Recent Events */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Star className="h-4 w-4" />
            Recent Activity
          </h4>
          <div className="space-y-2">
            {reputationData?.recentEvents?.map((event, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{event.reason}</span>
                <Badge variant={event.amount > 0 ? "default" : "destructive"}>
                  {event.amount > 0 ? "+" : ""}{event.amount}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Award className="h-4 w-4" />
            Recent Achievements
          </h4>
          <div className="space-y-2">
            {achievements?.slice(0, 3).map((achievement) => (
              <div key={achievement.achievement.title} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{achievement.achievement.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Unlocked {format(new Date(achievement.unlockedAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}