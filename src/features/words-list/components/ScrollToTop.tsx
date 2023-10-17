import cn from "~/utils/cn";
import { ChevronIcon } from "~/components/Icons";
import { forwardRef, type RefObject, useEffect, useState } from "react";
import { Button } from "~/components/Button";

type ScrollToTopProps = {
  isLoading: boolean;
};

const ScrollToTop = forwardRef<HTMLLIElement, ScrollToTopProps>(
  function ScrollToTop({ isLoading }: ScrollToTopProps, ref) {
    const [scrollToTop, setScrollToTop] = useState(false);

    useEffect(() => {
      if (isLoading) return;
      const element = (ref as RefObject<HTMLLIElement>).current;

      const observer = new IntersectionObserver(
        entries => {
          const entry = entries[0];

          const exists = entry?.target.isConnected;
          if (!exists) return;

          const isScrolledDown = entry.target.getBoundingClientRect().y < 0;
          if (!isScrolledDown) return;

          if (entry?.isIntersecting) setScrollToTop(false);
          if (!entry?.isIntersecting) setScrollToTop(true);
        },
        {
          rootMargin: "200px",
        },
      );

      if (element) observer.observe(element);
      return () => observer.disconnect();
    }, [isLoading, ref]);

    return (
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          scrollToTop ? "translate-x-1/2" : "invisible -translate-x-full",
          "fixed bottom-3 left-0 rounded-full p-4 shadow-3xl transition-[transform,visibility]",
        )}
      >
        <ChevronIcon width={24} className="-rotate-90" />
      </Button>
    );
  },
);

export default ScrollToTop;
