import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { connectWallet } from "@/lib/web3";

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
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Connect your wallet to get started with Sobol AI
          </p>
          <Button onClick={handleConnect} className="w-full">
            Connect CDP Smart Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
