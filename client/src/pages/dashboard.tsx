import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MissionCard from "@/components/mission-card";
import AIAgentConfig from "@/components/ai-agent-config";
import ReputationCard from "@/components/reputation-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Brain, Rocket } from "lucide-react";

export default function Dashboard() {
  // Mock user ID for now - this would come from auth context in production
  const userId = 1;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold tracking-tight">Mission Control</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Missions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">AI Agents</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">750</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="missions">
            <TabsList>
              <TabsTrigger value="missions">Active Missions</TabsTrigger>
              <TabsTrigger value="agents">AI Agents</TabsTrigger>
            </TabsList>
            <TabsContent value="missions" className="space-y-4">
              <div className="flex justify-end">
                <Button>New Mission</Button>
              </div>
              <div className="grid gap-4">
                <MissionCard
                  title="Governance Vote"
                  description="Participate in DAO governance voting"
                  reward={100}
                  progress={75}
                />
                <MissionCard
                  title="Token Staking"
                  description="Stake tokens in the liquidity pool"
                  reward={250}
                  progress={30}
                />
              </div>
            </TabsContent>
            <TabsContent value="agents">
              <AIAgentConfig />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <ReputationCard userId={userId} />
        </div>
      </div>
    </div>
  );
}