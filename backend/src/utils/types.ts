import { Maybe } from 'graphql/jsutils/Maybe';

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Demaybefy<T> = { [P in keyof T ]: T[P] extends Maybe<infer V> ? V : T[P] }
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Demaybefy<Pick<T, K>>>;
export type Replace<T, K extends keyof T, R> = Omit<T, K> & { [P in K]: R};
