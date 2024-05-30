type Monad<T> = {
    flatMap: <U>(f: (x: T) => Monad<U>) => Monad<U>;
    map: <U>(f: (x: T) => U) => Monad<U>; // map is just a special case of flatMap, not needed to make a Monad, but useful.
    return: <U>(x: U) => Monad<U>;
}

type Either<ErrT, T> = {
    flatMap: <U>(f: (x: T) => Either<ErrT, U>) => Either<ErrT, U>;
    map: <U>(f: (x: T) => U) => Either<ErrT, U>;
    return: <U>(x: U) => Either<ErrT, U>;
    match: <U>(f: (err: ErrT) => U, g: (val: T) => U) => U;
}

const Left = <ErrT, T>(err: ErrT): Either<ErrT, T> => ({
    flatMap: () => Left(err),
    map: () => Left(err),
    return: () => Left(err),
    match: (f) => f(err),
});

const Right = <ErrT, T>(val: T): Either<ErrT, T> => ({
    flatMap: (f) => f(val),
    map: (f) => Right(f(val)),
    return: (x) => Right(x),
    match: (_, g) => g(val),
});

type MaybeM<T> = {
    flatMap: <U>(f: (a: T) => MaybeM<U>) => MaybeM<U>;
    return: <U>(x: U) => MaybeM<U>;
}

const JustM = <T>(val: T): MaybeM<T> => ({
    flatMap: <U>(f: (a: T) => MaybeM<U>) => f(val),
    return: <U>(x: U) => JustM(x),
});

const NothingM = () => ({ flatMap: NothingM, return: () => NothingM() });
