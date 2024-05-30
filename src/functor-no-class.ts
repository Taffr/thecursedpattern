type Maybe<A> = { map: <B>(f: (x: A) => B) => Maybe<B> }
const Just = <A>(x: A): Maybe<A> => ({
    map: (f) => (x !== undefined || x !== null) ? Just(f(x)) : Nothing()
})
const Nothing = () => ({ map: Nothing })
