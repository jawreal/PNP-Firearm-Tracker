import { create } from "zustand";

interface DeactInfo {
  deactivatedAt: string;
  deactivatedBy: string;
  deactivationReason: string;
}

interface ICreateContext {
  user: DeactInfo | null;
  setDeactivationInfo: (info: DeactInfo | null) => void;
}

const useDeactivatedInfo = create<ICreateContext>((set) => ({
  user: null,
  setDeactivationInfo: (info) => set({ user: info }),
}));

export default useDeactivatedInfo;
