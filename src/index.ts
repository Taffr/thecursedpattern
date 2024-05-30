import { curry } from 'ramda'
// import { readFileSync } from 'fs'

interface Monoid <T> {
    mEmpty: T
    mAppend: (a: T, b: T) => T
}

const Sum: Monoid<number> = {
    mEmpty: 0,
    mAppend: (a, b) => a + b,
}

const Product: Monoid<number> = {
    mEmpty: 1,
    mAppend: (a, b) => a * b,
}

const Any : Monoid<boolean> = {
    mEmpty: false,
    mAppend: (a, b) => a || b,
}

const All : Monoid<boolean> = {
    mEmpty: true,
    mAppend: (a, b) => a && b,
}

const fold = <T>(m: Monoid<T>) => (l: T[])=> l.reduce(m.mAppend, m.mEmpty)

interface Functor <T> {
    fmap: <U>(f: (x: T) => U) => Functor<U>
}

const mightFail = (): Maybe<number>=> {
    try {
        return Just(1);
    }
    catch (e) {
        return Nothing();
    }
}

interface Either<L, R> extends Monad<R> {
    fmap: <U>(f: (x: R) => U) => Either<L, U>
}

const Left = <L> (x: L): Either<L, never> => ({
    fmap: (_: (x: never) => never) => Left(x),
    bind: (_: (x: never) => Either<L, never>) => Left(x),
})

const Right = <L, R>(x: R): Either<L, R> => ({
    fmap: f => Right(f(x)),
    bind: f => f(x),
})

const mightFailEither: () => Either<string, number> = () => {
    try {
        return Right(1);
    }
    catch (e) {
        return Left(e.message);
    }
}

interface Monad<T> extends Functor<T> {
    fmap: <U>(f: (x: T) => U) => Monad<U>
    bind: <U>(f: (x: T) => Monad<U>) => Monad<U>
}

interface Maybe<T> extends Monad<T> {}

const Nothing = <T>(): Maybe<T> => ({
    fmap: <U>(_: (x: T) => U) => Nothing<U>(),
    bind: <U>(_: (x: T) => Maybe<U>) => Nothing<U>()
})

const Just = <T>(x: T) : Maybe<T> => ({
    fmap: f => {
        if (x === undefined || x === null) return Nothing()
        return Just(f(x))
    },
    bind: f => {
        if (x === undefined || x === null) return Nothing()
        return f(x)
    }
})

const monoidsAndStuff = () => {
    const sum     = fold(Sum)
    const product = fold(Product)
    const any     = fold(Any) 
    const all     = fold(All)

    const s  = sum([ 1, 2, 3, 4 ])
    const p  = product([ 1, 2, 3, 4 ])
    const b1 = any([ false, false, true, false ]) 
    const b2 = all([ true, true, true, false ])

    const m = Just(1).fmap(x => x + 1).fmap(x => x * 2).fmap(() => 1 + 1)
    const m2 = Nothing<number>().fmap(x => x + 1).fmap(x => x * 2)

    const e = Right(1).fmap(x => x + 1).fmap(x => x * 2);

    mightFailEither().fmap(x => x + 1).fmap(x => x * 2);
    Left<string>('something').fmap(x => x + 1).fmap(x => x * 2);
    
    Nothing<number>().bind(x => Just(x + 1)).bind(x => Just(x * 2)).bind((x) => {
        console.log('hello from Monad');
        return Just(x + 1);
    });
}

const croc = (a: { foo: boolean; bar: string; baz: number }): string | number => a.foo ? a.bar : a.baz
const duck = (arr: string[]): string | number => arr.length < 10 ? arr.push('Quack!') : arr.shift()
const fish = (arr: { age: number; name: string }[]) => arr.filter(({ age }) => age >= 18)
const ape  = (a: number, b: number) => (c: number) => a + b + c

const mapMatchingPredicate = <T, U> (
    predicateFn: (x: T) => boolean,
    mapFn: (x: T) => U,
    arr: T[],
): U[] => arr.filter(predicateFn).map(mapFn)

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const r1 = mapMatchingPredicate((x) => x % 2 === 0, (x) => x * 2, arr) // [4, 8, 12, 16, 20]

const readFileUsingEncoding = (encoding: 'utf8' | 'hex' | 'base64') => (path: string): string =>
    readFileSync(path, { encoding })

const readUsingUTF8 = readFileUsingEncoding('utf8')
const readUsingHex = readFileUsingEncoding('hex')
const readUsingBase64 = readFileUsingEncoding('base64')

const file1 = readUsingUTF8('path/to/file1')
const file2 = readUsingHex('path/to/file2')
const file3 = readUsingBase64('path/to/file3')

const contains = <T>(x: T) => (arr: T[]): boolean => arr.includes(x)

const contains42 = contains(42)
const contains1337 = contains(1337)

const c1 = contains42([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // false
const c2 = contains1337([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // false
const c3 = contains42([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 42]) // true
const c4 = contains1337([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1337]) // true


const foo = (x: number) => {
    const bar = (y: number) => {
        const baz = (z: number) => {
            return x + y + z
        }

        return baz(3)
    }

    return bar(2)
}
const result = foo(1) // 6


const resutlt2 = result + 1;
const xxx = [c1, c2, c3, c4 ]
const f = file1 + file2 + file3


// const main = () => {
//     console.log(calculate(0, 10))
//     console.log(calculateFP(0)(10))
// 
//     console.log(calculate(2, 77))
//     console.log(calculateFP(2)(77))
// 
//     console.log(calculate(1337, 2077))
//     console.log(calculateFP(1337)(2077))
// 
//     console.log(calculate(-5, 500))
//     console.log(calculateFP(-5)(500))
// }


const sum = (arr: number[]): number => arr.reduce((acc, x) => acc + x, 0)
const range = (start: number) => (end: number): number[] => {
    if (start > end) return []
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
const filter = (predicate: (x: number) => boolean) => (arr: number[]): number[] => arr.filter(predicate)

const sumOfEvenNumbersInRange = (bottom: number) => (top: number) => {
    const evenNumbers = filter((x) => x % 2 === 0)
    const numberRange = range(bottom)(top)
    const evenNumbersInRange = evenNumbers(numberRange)
    return sum(evenNumbersInRange);
}

function calculate(bottom: number, top: number): number {
    if (top > bottom) {
        let sum = 0
        for (let number = bottom; number <= top; number++) {
            if (number % 2 === 0) {
                sum += number
            }
        }
        return sum
    } else {
        return 0
    }
}

// main()
