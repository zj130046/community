import { create } from "zustand";

interface UserState {
  user: { username?: string; userId?: number; avatarUrl?: string } | null;
  token: string | null;
  login: (userData: {
    username?: string;
    token: string;
    avatarUrl?: string;
  }) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  login: (userData) => {
    set({ user: userData, token: userData.token });
    localStorage.setItem("token", userData.token);
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
  },
}));

export default useUserStore;
