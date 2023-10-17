import { type NextRouter } from "next/router";

export default function setQueryParams(
  router: NextRouter,
  key: string,
  value: string | null,
  pathname?: string,
) {
  const deliminator = router.pathname;

  // https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization#how-it-works
  const params = new URLSearchParams(
    router.asPath.split(deliminator)[1] as string,
  );

  const existingValue = params.get(key);
  if (existingValue === value) return;

  if (value === null) params.delete(key);
  else params.set(key, value);

  void router.replace(
    {
      pathname: pathname || router.pathname,
      query: Object.fromEntries(params.entries()),
    },
    undefined,
    { shallow: true },
  );
}
