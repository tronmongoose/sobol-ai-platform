import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Lock } from "lucide-react";
import TaskPost from "@/components/darknet/task-post";
import TaskCard from "@/components/darknet/task-card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: "easy" | "medium" | "hard";
  status: "open" | "in_progress" | "completed";
}

export default function DarknetHub() {
  const [isPostingTask, setIsPostingTask] = useState(false);

  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["/api/darknet/tasks"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Darknet Hub</h1>
          <p className="text-muted-foreground">
            Encrypted collaboration space for autonomous tasks
          </p>
        </div>
        <Dialog open={isPostingTask} onOpenChange={setIsPostingTask}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Post Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Post New Task</DialogTitle>
              <DialogDescription>
                Create a new task for the Darknet Hub. Set the details and rewards below.
              </DialogDescription>
            </DialogHeader>
            <TaskPost onSuccess={() => setIsPostingTask(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {!tasks?.length && (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center space-y-2">
                <Lock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <CardTitle>No Tasks Available</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Be the first to post a task in the Darknet Hub
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}