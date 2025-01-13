import { create } from "zustand";

import { User } from "@/types";
import { axiosInstance } from "@/lib/axios";

interface ChatStoreState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get<User[]>("/users");
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
