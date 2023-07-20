import { create } from "zustand";

type UseHeaderDataProps = {
  isHeaderOpen: boolean;
  setIsHeaderOpen: (value?: boolean) => void;
};

const useHeaderData = create<UseHeaderDataProps>()(set => ({
  isHeaderOpen: false,
  setIsHeaderOpen: value =>
    set(state => ({
      isHeaderOpen: value ? value : !state.isHeaderOpen,
    })),
}));

export default useHeaderData;
