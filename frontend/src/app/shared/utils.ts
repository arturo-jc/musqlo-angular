import { Maybe } from "graphql/jsutils/Maybe";

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Demaybefy<T> = { [P in keyof T ]: T[P] extends Maybe<infer V> ? V : T[P] }
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Demaybefy<Pick<T, K>>>;

export type OptionalId<T extends { id: string }> = PartialBy<{
    [P in keyof T]:
        T[P] extends Maybe<Array<infer V>> ? V extends { id: string } ? Maybe<Array<OptionalId<V>>> : T[P] :
        T[P] extends Array<infer Item> ?
        Item extends { id: string } ? Array<OptionalId<Item>> : T[P]
        :
        T[P] extends { id: string } ? OptionalId<T[P]> : T[P]
}, 'id'>;

export type RequiredKey<T extends { key?: Maybe<string> }> = RequiredBy<T, 'key'>;

