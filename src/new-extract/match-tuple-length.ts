export type MatchTupleLength<T, U> =
  T extends readonly [] ? readonly [] :
  T extends readonly [unknown] ? readonly [U] :
  T extends readonly [unknown, unknown] ? readonly [U, U] :
  T extends readonly [unknown, unknown, unknown] ? readonly [U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown] ? readonly [U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U, U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U, U, U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U, U, U, U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U] :
  T extends readonly [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown] ? readonly [U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U] :
  T extends readonly unknown[] ? readonly U[] : U;


type Test1 = MatchTupleLength<[], []>;
const test1: Test1 = [];

// type Test2 = MatchTupleLength<[1,2,3], [[1,2,3]], number[]>;
// const test2: Test2 = [1,2,3];

type Test2 = MatchTupleLength<[1], number>;
const test2: Test2 = [1];
// @ts-expect-error
const test2_2: Test2 = [1, 2];

type Test3 = MatchTupleLength<[1,2], number>;
// @ts-expect-error
const test3: Test3 = [1];
const test3_2: Test3 = [1, 2];

type Test4 = MatchTupleLength<[1,2,3], [1,2,3,4]>;
const test4: Test4 = [[1,2,3,4],[1,2,3,4],[1,2,3,4]];

export type Tuple20<T> = 
  | readonly [T]
  | readonly [T, T]
  | readonly [T, T, T]
  | readonly [T, T, T, T]
  | readonly [T, T, T, T, T]
  | readonly [T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  | readonly [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]


function testFunction<
  S extends string | readonly string[] | Tuple20<string>
>(signal: S): MatchTupleLength<S, number> {
  return new Array<number>(signal.length).fill(0) as unknown as MatchTupleLength<S, number>;
}

let r = testFunction(["a", "b", "c","a", "b", "c","a", "b", "c","a", "b", "c","a", "b", "c","a", "b", "c","a", "b", "c"]);