import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { connectWallet } from "@/lib/web3";

export default function Navbar() {
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Your CDP Smart Wallet has been connected successfully.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-end h-16 px-6 border-b">
      <Button onClick={handleConnect} variant="outline" className="gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    </div>
  );
}
