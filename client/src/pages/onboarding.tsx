import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import WalletConnect from "@/components/wallet-connect";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();

  const steps = [
    {
      title: "Connect Wallet",
      component: <WalletConnect onComplete={() => setStep(2)} />,
    },
    {
      title: "Setup AI Agent",
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground">Configure your autonomous agent preferences</p>
          <Button onClick={() => setLocation("/")}>Complete Setup</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container max-w-2xl mx-auto pt-20">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Sobol AI</CardTitle>
          <Progress value={(step / steps.length) * 100} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">{steps[step - 1].title}</h2>
          {steps[step - 1].component}
        </CardContent>
      </Card>
    </div>
  );
}
