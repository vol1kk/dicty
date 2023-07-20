import { create } from "zustand";
import { type Session } from "next-auth";

type UseSessionDataProps = {
  sessionData: Session | null;
  setSession: (data: Session | null) => void;
  isAuthed: boolean;
};

const useSessionData = create<UseSessionDataProps>()(set => {
  return {
    sessionData: null,
    isAuthed: false,
    setSession: data => set(() => ({ sessionData: data, isAuthed: !!data })),
  };
});

export default useSessionData;
