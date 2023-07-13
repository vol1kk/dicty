export interface FieldArrayHelpers {
  push: <T>(obj: T) => void;
  swap: (indexA: number, indexB: number) => void;
  move: (from: number, to: number) => void;
  insert: <T>(index: number, value: T) => void;
  unshift: <T>(value: T) => number;
  remove: <T>(index: number) => T | undefined;
  pop: <T>() => T | undefined;
  replace: <T>(index: number, value: T) => void;
}
