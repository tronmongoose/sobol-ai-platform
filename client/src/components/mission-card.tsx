import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";

interface MissionCardProps {
  title: string;
  description: string;
  reward: number;
  progress: number;
}

export default function MissionCard({ title, description, reward, progress }: MissionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Coins className="h-4 w-4" />
          {reward}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="space-y-1">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground text-right">{progress}% Complete</p>
        </div>
      </CardContent>
    </Card>
  );
}
