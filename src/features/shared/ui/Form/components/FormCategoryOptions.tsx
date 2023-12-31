import { useTranslation } from "next-i18next";

import cn from "~/utils/cn";
import Dropdown from "~/components/Dropdown";
import { Button } from "~/components/Button";
import { DotsIcon } from "~/features/shared/ui/Form";

type CategoryOptionsProps = {
  categoriesLength: number;
  currentCategory: number;
  callback: (data: HTMLLIElement) => void;
};

export default function FormCategoryOptions({
  callback,
  categoriesLength,
  currentCategory,
}: CategoryOptionsProps) {
  const { t } = useTranslation();
  const CATEGORY_OPTIONS = [
    {
      displayName: t("form.word.category.meaning.add"),
      action: "add-meaning",
    },
    {
      displayName: t("form.word.category.add"),
      action: "add-category",
    },
    {
      displayName: t("form.word.category.remove"),
      action: "remove-category",
    },
    {
      displayName: t("form.word.category.up"),
      action: "move-up",
      className: currentCategory === 0 && "hidden",
    },
    {
      displayName: t("form.word.category.down"),
      action: "move-down",
      className: currentCategory === categoriesLength - 1 && "hidden",
    },
  ];

  return (
    <Dropdown
      className="relative p-2 focus-within:outline-0"
      tabIndex={-1}
      renderTitle={() => (
        <Button className="rounded-full bg-primary bg-opacity-30 p-2">
          <span className="sr-only">{t("form.word.category.edit")}</span>
          <DotsIcon className="h-[16px] w-[16px] fill-primary dark:fill-white" />
        </Button>
      )}
      renderContent={dropdownItemHandler => {
        return (
          <ul
            onClick={e => e.preventDefault()}
            className="absolute -top-10 right-0 whitespace-nowrap rounded-md bg-white p-4 shadow-subtle dark:bg-gray-900 dark:shadow-3xl [&>li]:cursor-pointer [&>li]:leading-10"
          >
            {CATEGORY_OPTIONS.map((options, index) => (
              <li
                key={options.action}
                role="option"
                aria-selected={0 === index}
                onClick={dropdownItemHandler}
                data-action={options.action}
                className={cn(
                  "outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary",
                  options.className,
                )}
              >
                {options.displayName}
              </li>
            ))}
          </ul>
        );
      }}
      callback={callback}
    />
  );
}
