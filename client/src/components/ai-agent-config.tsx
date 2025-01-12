import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { configureAgent } from "@/lib/ai";

export default function AIAgentConfig() {
  const [autoVote, setAutoVote] = useState(false);
  const [riskLevel, setRiskLevel] = useState([50]);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await configureAgent({ autoVote, riskLevel: riskLevel[0] });
      toast({
        title: "Settings Saved",
        description: "AI agent configuration updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update AI agent configuration.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Agent Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-vote">Automatic Governance Voting</Label>
          <Switch
            id="auto-vote"
            checked={autoVote}
            onCheckedChange={setAutoVote}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Risk Level</Label>
          <Slider
            value={riskLevel}
            onValueChange={setRiskLevel}
            min={0}
            max={100}
            step={1}
          />
          <p className="text-sm text-muted-foreground">
            Set the risk tolerance for automated actions
          </p>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
}
