// biome-ignore lint/complexity/noBannedTypes: Function type is needed for pattern matching
type MatchPattern<T> = T extends Function ? never : T;
type MatchPredicate<T> = (inputValue: T) => boolean;

type MatchPatternDef<T, R> = {
  pattern: MatchPattern<T> | MatchPredicate<T>;
  handler: (inputValue: T) => R;
};

type MatchResult<T, R> = {
  with: <U>(
    pattern: MatchPattern<T> | MatchPredicate<T>,
    handler: (inputValue: T) => U
  ) => MatchResult<T, R | U>;
  default: <U>(handler: (inputValue: T) => U) => R | U;
};

export function match<T>(inputValue: T): MatchResult<T, never> {
  const patterns: MatchPatternDef<T, unknown>[] = [];
  let defaultHandler: ((value: T) => unknown) | null = null;

  const result: MatchResult<T, unknown> = {
    with: (pattern, handler) => {
      patterns.push({ pattern, handler });
      return result as MatchResult<T, unknown>;
    },

    default: (handler) => {
      defaultHandler = handler;
      return execute();
    },
  };

  function execute(): unknown {
    for (const patternDef of patterns) {
      if (typeof patternDef.pattern === "function") {
        if ((patternDef.pattern as MatchPredicate<T>)(inputValue)) {
          return patternDef.handler(inputValue);
        }
      } else if (patternDef.pattern === inputValue) {
        return patternDef.handler(inputValue);
      }
    }

    if (defaultHandler) {
      return defaultHandler(inputValue);
    }

    throw new Error(`No matching pattern found for value: ${inputValue}`);
  }

  return result as MatchResult<T, never>;
}

export function when(condition: boolean): MatchResult<boolean, never> {
  return match(condition);
}
