import { create } from "zustand";
import { type Session } from "next-auth";
import { type useSession } from "next-auth/react";

type StatusTypes = ReturnType<typeof useSession>["status"];

type UseSessionDataProps = {
  isAuthed: boolean;
  session: Session | null;
  status: StatusTypes | null;
  setSession: (sessionData: ReturnType<typeof useSession>) => void;
};

const useSessionData = create<UseSessionDataProps>()(set => {
  return {
    session: null,
    status: null,
    isAuthed: false,
    setSession: sessionData =>
      set(() => ({
        session: sessionData.data,
        status: sessionData.status,
        isAuthed: !!sessionData.data,
      })),
  };
});

export default useSessionData;
