interface Functor<A> {
  map<B>(f: (a: A) => B): Functor<B>
}

interface Applicative<T> {
  pure(x: T): Applicative<T>
}

interface Monad<T> extends Functor<T> {
  map<B>(f: (a: T) => B): Monad<B>
  flatMap<U>(f: (a: T) => Monad<U>): Monad<U>
}

abstract class Maybe<T> implements Monad<T> {
  abstract flatMap<U>(f: (a: T) => Maybe<U>): Maybe<U>;
  abstract map<B>(f: (a: T) => B): Maybe<B>;
}

class Nothing extends Maybe<never> {
  constructor() { super(); }

  map<B>(): Maybe<B> {
    return new Nothing();
  }

  flatMap<B>(): Maybe<B> {
    return new Nothing();
  }
} 

class Just<T> extends Maybe<T> {
  private constructor (readonly t:T) { super(); }
  static of<A>(v: A): Maybe<A> {
    if (v) {
      return new Just(v);
    }

    return new Nothing();
  }

  map<B> (f: (a: T) => B): Maybe<B> {
    return this.flatMap((t) => Just.of(f(t)));
  }

  flatMap<B> (f: (a: T) => Maybe<B>) {
    if (this.t) {
      return f(this.t);
    }

    return new Nothing();
  }
}

const NothingT = () => ({ map: NothingT })
const JustT = <T>(t: T): Functor<T> => ({
  map: (f) => t ? JustT(f(t)) : NothingT()
})

interface MaybeT <T> extends Monad<T> {}
const NothingM = (): MaybeT<never> => ({ map: NothingM, flatMap: NothingM })
const JustM = <T>(t: T): MaybeT<T> => ({
  map: (f) => t ? JustM(f(t)) : NothingM(),
  flatMap: (f) => t ? f(t) : NothingM(),
})
const MaybeOf= <T>(x: T) => x ? JustM(x) : NothingM();


const MY_NUMS = [1, 2, 3, 4, 6, 8];
const test = (m: Functor<number>) => m
  .map((x) => MY_NUMS[MY_NUMS.indexOf(x)])
  .map((n) => n > 0)
  .map((b) => b ? 1 : -1)

const testM = (ap: <T>(a: T) => Monad<T>) => (m: Monad<number>) => m
  .flatMap((x) => ap(MY_NUMS[MY_NUMS.indexOf(x)]))
  .map((n) => n > 0)
  .flatMap((b) => ap(b ? 1 : -1))

const res1  = test(Just.of(1)).map((x) => console.log(`is there a result here? ${x}`));
const res2  = test(Just.of(-1)).map((x) => console.log(`What about here? ${x}`));

const resT1 = test(JustM(1)).map((x) => console.log(`is there a result here (no classes)? ${x}`));
const resT2 = test(Just.of(-1)).map((x) => console.log(`What about here? (no classes) ${x}`));

const list = test([0, 1, 100]).map((x) => console.log(x));

const resMClass =
  testM(Just.of)(Just.of(1)).map((x) => console.log(`is there are a Monad result here (class)? ${x}`));

const resMType =
  testM(MaybeOf)(MaybeOf(1)).map((x) => console.log(`is there are a Monad result here (type)? ${x}`));

const listM =
  testM(<T>(x:T) => [x] as unknown as Monad<T>)([0, 1, 100] as unknown as Monad<number>).map((x) => console.log(x));
