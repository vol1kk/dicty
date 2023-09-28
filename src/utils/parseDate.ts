export default function parseDate<
  T extends { createdAt: unknown; interval: unknown },
>(data: T) {
  const createdAt = data.createdAt;
  const interval = data.interval;

  if (typeof createdAt === "string") data.createdAt = new Date(createdAt);

  if (typeof interval === "string") data.interval = new Date(interval);

  return data;
}
