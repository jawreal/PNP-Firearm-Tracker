import { create } from "zustand";

interface AuthStore {
  user: Partial<IAdminUsers> | null; // user credentials
  isAuthenticated: boolean; // to check if user is authenticated
  setUser: (user: Partial<IAdminUsers> | null) => void; // set the user
  clear: () => void; // clear the session
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clear: () => set({ user: null, isAuthenticated: false }),
}));

export default useAuthStore;
