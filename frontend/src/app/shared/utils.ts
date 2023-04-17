export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type OptionalId<T extends { id: string }> = PartialBy<{
    [P in keyof T]: T[P] extends Array<infer Item> ?
        Item extends { id: string } ? Array<OptionalId<Item>> : T[P]
        :
        T[P] extends { id: string } ? OptionalId<T[P]> : T[P]
}, 'id'>;

export type WithKey<T> = T & { key: string; };
export type Frontend<T extends { id: string }> = WithKey<OptionalId<T>>;
