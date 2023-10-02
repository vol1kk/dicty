export default function assertNever(x: never): never {
  throw new Error(
    `Exhaustive switch failed. Passed value is not of type never: `,
    x,
  );
}
