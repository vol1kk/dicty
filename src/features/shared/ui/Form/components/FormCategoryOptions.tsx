import { useTranslation } from "next-i18next";

import Dropdown from "~/components/Dropdown";
import Button from "~/components/Button/Button";
import { DotsIcon } from "~/features/shared/ui/Form";

type CategoryOptionsProps = {
  callback: (data: HTMLLIElement) => void;
};

export default function CategoryOptions({ callback }: CategoryOptionsProps) {
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
  ];

  return (
    <Dropdown
      className="relative p-2"
      tabIndex={-1}
      renderTitle={() => (
        <Button className="rounded-full bg-primary bg-opacity-30 p-2 dark:bg-gray-800">
          <span className="sr-only">{t("form.word.category.edit")}</span>
          <DotsIcon className="h-[16px] w-[16px] fill-primary dark:fill-white" />
        </Button>
      )}
      renderContent={dropdownItemHandler => {
        return (
          <ul
            onClick={e => e.preventDefault()}
            className="absolute -top-5 right-0 whitespace-nowrap rounded-md bg-white p-4 shadow-xl dark:bg-gray-900 [&>li]:cursor-pointer [&>li]:leading-10"
          >
            {CATEGORY_OPTIONS.map((options, index) => (
              <li
                key={options.action}
                role="option"
                aria-selected={0 === index}
                onClick={dropdownItemHandler}
                data-action={options.action}
                className="outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary"
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
