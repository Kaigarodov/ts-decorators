/*
Задача 4.
  Реализовать декоратор метода для кеширования результата функции
*/

function Memorize() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value.bind(target);
    const cache = new Map();
    descriptor.value = (...args: any) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      } else {
        const result = originalMethod(...args);
        cache.set(key, result);
        return result;
      }
    };
  };
}
class MathOperation {
  @Memorize()
  public makeBigCalculation(n: number) {
    for (let i = 0; i < Math.pow(n, 5); i++) {}
    return Math.pow(n,3)
  }

  @Memorize()
  public findGreatestCommonDivisor(a: number, b: number): number {
    if (b == 0) {
      return a;
    } else {
      return this.findGreatestCommonDivisor(b, a % b);
    }
  }
}

const math = new MathOperation();

console.log(math.findGreatestCommonDivisor(28, 64)); //4
console.log(math.findGreatestCommonDivisor(84, 90)); //6
console.log(math.findGreatestCommonDivisor(24, 18)); //6
console.log(math.makeBigCalculation(10))
console.log(math.makeBigCalculation(10))
