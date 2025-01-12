import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { executeTransaction } from "@/lib/web3";

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: "easy" | "medium" | "hard";
  status: "open" | "in_progress" | "completed";
}

interface TaskCardProps {
  task: Task;
}

const difficultyColors = {
  easy: "bg-green-500/10 text-green-500",
  medium: "bg-yellow-500/10 text-yellow-500",
  hard: "bg-red-500/10 text-red-500",
};

export default function TaskCard({ task }: TaskCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: async () => {
      try {
        // First register acceptance on backend
        const res = await fetch(`/api/darknet/tasks/${task.id}/accept`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Failed to accept task");

        // Execute CDP transaction to lock collateral
        await executeTransaction({
          to: import.meta.env.VITE_CDP_CONTRACT_ADDRESS || "",
          amount: task.reward * 0.1, // Lock 10% of reward as collateral
          data: `accept_task:${task.id}`, // Custom data for the contract
        });

        return res.json();
      } catch (error) {
        throw new Error("Failed to accept task: " + (error as Error).message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/darknet/tasks"] });
      toast({
        title: "Task Accepted",
        description: "You have successfully accepted this task and locked collateral.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl">{task.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={difficultyColors[task.difficulty]}
            >
              {task.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Coins className="w-3 h-3" />
              {task.reward} SOBOL
            </Badge>
          </div>
        </div>
        {task.status === "open" && (
          <Button
            variant="secondary"
            onClick={() => acceptMutation.mutate()}
            disabled={acceptMutation.isPending}
          >
            <Shield className="w-4 h-4 mr-2" />
            Accept Mission
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{task.description}</p>
      </CardContent>
    </Card>
  );
}