import Button from "~/components/Button/Button";
import { api } from "~/utils/api";
import { forwardRef, type MutableRefObject } from "react";

export default forwardRef<HTMLInputElement>(function FormCodeShare({}, ref) {
  const utils = api.useContext();

  const { mutate: importFromCode } = api.words.importFromCode.useMutation({
    onSuccess() {
      utils.words.invalidate().catch(console.error);
    },
  });

  function shareCodeFormHandler(e: React.FormEvent) {
    e.preventDefault();
    if (!ref) return;
    const assertedRef = ref as MutableRefObject<HTMLInputElement>;
    if (assertedRef.current)
      importFromCode({ code: assertedRef.current.value });
  }

  return (
    <form onSubmit={shareCodeFormHandler} className="grid gap-2 px-4 py-1">
      <input
        ref={ref}
        className="rounded-md bg-gray-300 px-4 py-2 outline-1 outline-offset-2 outline-primary focus-visible:outline dark:bg-gray-900"
        placeholder="Enter Code"
        type="text"
      />
      <Button
        className="rounded-md bg-gray-300 p-2 !outline-1 dark:bg-gray-900"
        isSubmit={true}
      >
        Import from Code
      </Button>
    </form>
  );
});
