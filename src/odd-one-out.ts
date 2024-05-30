const croc = (a: { foo: boolean; bar: string; baz: number }): string | number => a.foo ? a.bar : a.baz
const duck = (arr: string[]): string | number => arr.length < 10 ? arr.push('Quack!') : arr.shift()
const fish = (arr: { age: number; name: string }[]) => arr.filter(({ age }) => age >= 18)
const ape  = (a: number, b: number) => (c: number) => a + b + c
