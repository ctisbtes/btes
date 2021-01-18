type WordSeparators = '-' | '_' | ' ';

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

type InnerCamelCaseStringArray<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Parts extends any[],
  PreviousPart
> = Parts extends [`${infer FirstPart}`, ...infer RemainingParts]
  ? FirstPart extends undefined
    ? ''
    : FirstPart extends ''
    ? InnerCamelCaseStringArray<RemainingParts, PreviousPart>
    : `${PreviousPart extends ''
        ? FirstPart
        : Capitalize<FirstPart>}${InnerCamelCaseStringArray<
        RemainingParts,
        FirstPart
      >}`
  : '';

type CamelCaseStringArray<Parts extends string[]> = Parts extends [
  `${infer FirstPart}`,
  ...infer RemainingParts
]
  ? Uncapitalize<`${FirstPart}${InnerCamelCaseStringArray<
      RemainingParts,
      FirstPart
    >}`>
  : never;

export type CamelCase<K> = K extends string
  ? CamelCaseStringArray<Split<K, WordSeparators>>
  : K;
