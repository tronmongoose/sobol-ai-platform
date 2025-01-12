import { initializeCDPWallet, executeSecureTransaction, type CDPWallet } from "./cdp";
import { ethers } from "ethers";

export async function connectWallet(): Promise<CDPWallet> {
  try {
    // Request account access
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const wallet = await initializeCDPWallet();
      return wallet;
    }
    throw new Error("No Ethereum wallet found. Please install MetaMask.");
  } catch (error) {
    throw new Error("Failed to connect wallet: " + (error as Error).message);
  }
}

export async function executeTransaction(params: {
  to: string;
  amount: number;
  data?: string;
}): Promise<string> {
  try {
    const value = ethers.utils.parseEther(params.amount.toString());
    return await executeSecureTransaction({
      to: params.to,
      value,
      data: params.data,
    });
  } catch (error) {
    throw new Error("Transaction failed: " + (error as Error).message);
  }
}