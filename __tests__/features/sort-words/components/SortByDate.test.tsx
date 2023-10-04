import mockRouter from "next-router-mock";
import { describe, it, vi, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { SortByDate, type SortByDateType } from "~/features/sort-words";
import { type SortByDateProps } from "~/features/sort-words/components/SortByDate";

function setup(props?: Partial<SortByDateProps>) {
  const currentOrderByDate: SortByDateType = "newest";
  const setOrderByDate = vi.fn();

  const data = render(
    <SortByDate
      setOrderByDate={props?.setOrderByDate || setOrderByDate}
      currentOrderByDate={props?.currentOrderByDate || currentOrderByDate}
    />,
    { wrapper: MemoryRouterProvider },
  );

  const sortByOrderContainer = screen.getByTestId("dropdown");
  const switchToNewest = screen.getByTestId("order-newest");
  const switchToOldest = screen.getByTestId("order-oldest");

  return {
    data,
    setOrderByDate,
    switchToNewest,
    switchToOldest,
    currentOrderByDate,
    sortByOrderContainer,
  };
}

describe("SortByDate tests", function () {
  it("should render SortByDate component", () => {
    const { sortByOrderContainer } = setup();

    expect(sortByOrderContainer).toBeInTheDocument();
  });

  it("should select order by newest", () => {
    const { switchToNewest } = setup();

    fireEvent.click(switchToNewest);

    expect(mockRouter.query.order).toEqual("newest");
  });

  it("should select order by oldest", () => {
    const { switchToOldest } = setup();

    fireEvent.click(switchToOldest);

    expect(mockRouter.query.order).toEqual("oldest");
  });
});
