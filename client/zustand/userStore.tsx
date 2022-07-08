import create from "zustand";
import { devtools } from "zustand/middleware";

interface userType {
  name?: string;
}

interface userStateType {
  user: userType;
  setUser: (user: userType) => void;
}

export const useUserStore = create<userStateType>()(
  devtools((set) => ({
    user: {},
    setUser: (user) => set(() => ({ user })),
  }))
);
