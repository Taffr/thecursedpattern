interface FunctorInstance<T> {
    map<B>(f: (a: T) => B): FunctorInstance<B>;
}

abstract class MaybeInstance<T> implements FunctorInstance<T> {
    abstract map<B>(f: (a: T) => B): Maybe<B>;
}

class JustInstance<T> extends MaybeInstance<T> {
    of<T>(value: T): JustInstance<T> {
        return new JustInstance(value);
    }

    constructor(private readonly value: T) {
        super();
    }

    map<B>(f: (a: T) => B): Maybe<B> {
        return this.value ? new JustInstance(f(this.value)) : new NothingInstance<B>();
    }
}

class NothingInstance<T> extends MaybeInstance<T> {
    map<B>(): MaybeInstance<B> {
        return new NothingInstance<B>();
    }
}
