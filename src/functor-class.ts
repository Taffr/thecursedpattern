interface FunctorInstance<T> {
  map<B>(f: (a: T) => B): FunctorInstance<B>
}

abstract class MaybeInstance<T> implements FunctorInstance<T> {
  abstract map<B>(f: (a: T) => B): Maybe<B>
}

class JustInstance<T> extends MaybeInstance<T> {
  private constructor(private readonly value: T) {
    super()
  }

  of<T>(value: T): MaybeInstance<T> {
    return value !== undefined || value !== null
      ? new JustInstance(value)
      : new NothingInstance()
  }

  map<B>(f: (a: T) => B): Maybe<B> {
    return this.value !== undefined || this.value !== null
      ? new JustInstance(f(this.value))
      : new NothingInstance<B>()
  }
}

class NothingInstance<T> extends MaybeInstance<T> {
  map<B>(): MaybeInstance<B> {
    return new NothingInstance<B>()
  }
}
