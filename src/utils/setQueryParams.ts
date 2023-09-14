import { type NextRouter } from "next/router";

export default function setQueryParams(
  router: NextRouter,
  key: string,
  value: string,
  pathname?: string,
) {
  const params = new URLSearchParams(router.query as Record<string, string>);

  const existingValue = params.get(key);
  if (existingValue === value) return;

  params.set(key, value);
  void router.replace({
    pathname: pathname || router.pathname,
    query: params.toString(),
  });
}
