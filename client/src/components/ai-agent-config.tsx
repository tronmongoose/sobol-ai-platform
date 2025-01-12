import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { configureAgent, getAgentStatus } from "@/lib/ai";
import { AlertCircle } from "lucide-react";

export default function AIAgentConfig() {
  const [autoVote, setAutoVote] = useState(false);
  const [riskLevel, setRiskLevel] = useState([50]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is configured
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      setError("OpenAI API key not configured. Please set up your API key to enable AI features.");
    }
  }, []);

  const handleSave = async () => {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        title: "Configuration Error",
        description: "Please configure your OpenAI API key first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await configureAgent({ autoVote, riskLevel: riskLevel[0] });
      toast({
        title: "Settings Saved",
        description: "AI agent configuration updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

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
            disabled={isLoading}
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
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            Set the risk tolerance for automated actions
          </p>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Configuration"}
        </Button>
      </CardContent>
    </Card>
  );
}