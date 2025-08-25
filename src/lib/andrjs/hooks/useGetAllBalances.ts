import { coin, Coin } from "@cosmjs/proto-signing";
import { useEffect, useState } from "react";
import useAndromedaClient from "./useAndromedaClient";
import { useQuery } from "@tanstack/react-query";
import { trpcReactClient } from "@/lib/trpc/client";

interface TokenBalance {
  denom: string;
  amount: string;
  type: 'native' | 'cw20';
  contractAddress?: string;
}

interface AllBalances {
  balances: TokenBalance[];
  totalValue: string;
  isLoading: boolean;
  error: any;
  debug: {
    address: string | undefined;
    clientConnected: boolean;
    queriesEnabled: boolean;
    environment: {
      chainIdentifier: string | undefined;
      databaseApiUrl: string | undefined;
    };
  };
}

/**
 * Gets balances for known tokens (uandr, andr, and any CW20 tokens) for a given address
 * @param address - The address to query balances for
 * @returns All balances including native and CW20 tokens
 */
export default function useGetAllBalances(address?: string): AllBalances {
  const client = useAndromedaClient();

  // Log environment variables for debugging
  useEffect(() => {
    console.log("useGetAllBalances: Environment check", {
      NEXT_PUBLIC_CHAIN_IDENTIFIER: process.env.NEXT_PUBLIC_CHAIN_IDENTIFIER,
      NEXT_PUBLIC_DATABASE_API_URL: process.env.NEXT_PUBLIC_DATABASE_API_URL,
      NODE_ENV: process.env.NODE_ENV
    });
  }, []);

  // Get uandr balance (native token)
  const { data: uandrBalance, isLoading: uandrLoading, error: uandrError } = useQuery({
    queryKey: ["balance", "uandr", address],
    queryFn: async () => {
      if (!client || !address) {
        console.log("useGetAllBalances: No client or address", { client: !!client, address });
        return coin(0, "uandr");
      }
      try {
        console.log("useGetAllBalances: Querying uandr balance for", address);
        const balance = await client.queryClient!.getBalance(address, "uandr");
        console.log("useGetAllBalances: uandr balance result", balance);
        return balance;
      } catch (error) {
        console.error("Error getting uandr balance:", error);
        return coin(0, "uandr");
      }
    },
    enabled: !!client && !!address,
  });

  // Get andr balance (native token)
  const { data: andrBalance, isLoading: andrLoading, error: andrError } = useQuery({
    queryKey: ["balance", "andr", address],
    queryFn: async () => {
      if (!client || !address) {
        console.log("useGetAllBalances: No client or address for andr", { client: !!client, address });
        return coin(0, "andr");
      }
      try {
        console.log("useGetAllBalances: Querying andr balance for", address);
        const balance = await client.queryClient!.getBalance(address, "andr");
        console.log("useGetAllBalances: andr balance result", balance);
        return balance;
      } catch (error) {
        console.error("Error getting andr balance:", error);
        return coin(0, "andr");
      }
    },
    enabled: !!client && !!address,
  });

  // You can add more known token denoms here
  const knownDenoms = ["uandr", "andr"];

  // Get balances for all known denoms
  const { data: allNativeBalances, isLoading: allNativeLoading, error: allNativeError } = useQuery({
    queryKey: ["all-native-balances", address, knownDenoms],
    queryFn: async () => {
      if (!client || !address) {
        console.log("useGetAllBalances: No client or address for all native balances", { client: !!client, address });
        return [];
      }
      
      console.log("useGetAllBalances: Querying all native balances for", address);
      const balances: TokenBalance[] = [];
      
      for (const denom of knownDenoms) {
        try {
          const balance = await client.queryClient!.getBalance(address, denom);
          console.log(`useGetAllBalances: ${denom} balance result`, balance);
          if (balance && parseFloat(balance.amount) > 0) {
            balances.push({
              denom: balance.denom,
              amount: balance.amount,
              type: 'native' as const
            });
          }
        } catch (error) {
          console.error(`Error getting ${denom} balance:`, error);
        }
      }
      
      console.log("useGetAllBalances: All native balances result", balances);
      return balances;
    },
    enabled: !!client && !!address,
  });

  // For CW20 tokens, you would need to know the contract addresses
  // This is a placeholder - you can expand this based on your specific CW20 contracts
  const { data: cw20Balances, isLoading: cw20Loading, error: cw20Error } = useQuery({
    queryKey: ["cw20-balances", address],
    queryFn: async () => {
      // This is a placeholder - you'll need to implement based on your CW20 contracts
      // You might want to query specific CW20 contract addresses or get them from a registry
      console.log("useGetAllBalances: CW20 balances placeholder - no contracts configured");
      return [];
    },
    enabled: !!client && !!address,
  });

  const balances = [
    ...(allNativeBalances || []),
    ...(cw20Balances || [])
  ];

  // Calculate total value (this is simplified - you might want to add price conversion)
  const totalValue = balances.reduce((sum, balance) => {
    const amount = parseFloat(balance.amount) || 0;
    return sum + amount;
  }, 0).toString();

  console.log("useGetAllBalances: Final result", {
    balances,
    totalValue,
    address,
    clientConnected: !!client,
    queriesEnabled: !!client && !!address
  });

  return {
    balances,
    totalValue,
    isLoading: uandrLoading || andrLoading || allNativeLoading || cw20Loading,
    error: uandrError || andrError || allNativeError || cw20Error,
    debug: {
      address,
      clientConnected: !!client,
      queriesEnabled: !!client && !!address,
      environment: {
        chainIdentifier: process.env.NEXT_PUBLIC_CHAIN_IDENTIFIER,
        databaseApiUrl: process.env.NEXT_PUBLIC_DATABASE_API_URL
      }
    }
  };
}
