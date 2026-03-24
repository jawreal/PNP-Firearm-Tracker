import { create } from "zustand";

interface IGunType {
  gunType: "long" | "short";
  setGunType: (gunType: "long" | "short") => void;
}

const useGunType = create<IGunType>((set) => ({
  gunType: "short",
  setGunType: (gunType) => set({ gunType }),
}));

export default useGunType;
