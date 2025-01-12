import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { connectWallet } from "@/lib/web3";
import { Wallet } from "lucide-react";

interface WalletConnectProps {
  onComplete: () => void;
}

export default function WalletConnect({ onComplete }: WalletConnectProps) {
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Your CDP Smart Wallet has been created successfully.",
      });
      onComplete();
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-2 border-primary">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <p className="font-semibold">Connect Your Wallet</p>
          </div>
          <p className="text-muted-foreground">
            Connect your wallet to start using Sobol AI's decentralized features
          </p>
          <Button onClick={handleConnect} className="w-full">
            Connect CDP Smart Wallet
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Make sure you have MetaMask installed
          </p>
        </div>
      </CardContent>
    </Card>
  );
}