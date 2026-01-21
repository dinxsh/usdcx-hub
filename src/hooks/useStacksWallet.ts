import { useState, useCallback, useEffect } from "react";
import { showConnect, disconnect as stacksDisconnect, UserSession, AppConfig } from "@stacks/connect";
import { StacksWallet } from "@/types";
import { STACKS_APP_DETAILS } from "@/config/stacks";

// Create app config and user session
const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export function useStacksWallet() {
  const [wallet, setWallet] = useState<StacksWallet>({
    status: "disconnected",
    principal: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          const principal = userData.profile?.stxAddress?.mainnet;
          if (principal) {
            setWallet({
              status: "connected",
              principal,
            });
          }
        }
      } catch (error) {
        console.error("Error checking Stacks session:", error);
      }
    };

    checkExistingSession();
  }, []);

  const connect = useCallback(async () => {
    setWallet((prev) => ({ ...prev, status: "connecting" }));

    try {
      showConnect({
        appDetails: STACKS_APP_DETAILS,
        onFinish: () => {
          if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            const principal = userData.profile?.stxAddress?.mainnet;
            setWallet({
              status: "connected",
              principal: principal || null,
            });
          }
        },
        onCancel: () => {
          setWallet({
            status: "disconnected",
            principal: null,
          });
        },
        userSession,
      });
    } catch (error) {
      console.error("Stacks connection error:", error);
      setWallet({
        status: "disconnected",
        principal: null,
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    try {
      if (userSession.isUserSignedIn()) {
        userSession.signUserOut();
      }
    } catch (error) {
      console.error("Error disconnecting Stacks wallet:", error);
    }
    setWallet({
      status: "disconnected",
      principal: null,
    });
  }, []);

  return {
    wallet,
    connect,
    disconnect,
    isConnected: wallet.status === "connected",
    principal: wallet.principal,
    userSession,
  };
}

// Format Stacks principal for display
export function formatPrincipal(principal: string | null, chars = 4): string {
  if (!principal) return "";
  return `${principal.slice(0, chars + 2)}…${principal.slice(-chars)}`;
}
