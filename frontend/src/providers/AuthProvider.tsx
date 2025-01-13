import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

import { useAuthStore } from "@/stores/useAuthStore";

const updateApiToken = (token: string | null) => {
  token
    ? (axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`)
    : delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token) {
          checkAdminStatus();
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        updateApiToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [getToken]);

  if (isLoading) {
    <div className="h-screen w-full flex items-center justify-center">
      <Loader className="animate-spin size-8 text-emerald-500" />
    </div>;
  }

  return <>{children}</>;
};

export default AuthProvider;
