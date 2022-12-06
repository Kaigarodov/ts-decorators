/* 
Задание 2. 
Реализовать декоратор метода. Декоратор подсчитывает количество вызовов метода и 
количество переданных значений для каждого аргумента.

Для получения имен параметров метода использовать функцию getParamNames
Класс SomeClass изменять нельзя.

Пример:
>> console.log((SomeClass.prototype as any).__stats)
{
  "method0": {
    "callAmount": 10,
    "argsData": {
      "test": 10,
      "t": 10,
      "z": 8,
      "y": 4,
      "...args": 2
    }
  },
  "method1": { ... },
  "method2": { ... }
}

*/

interface IStats {
  [key: string] : {
    callAmount: number;
    argsData: {
      [key: string] : number
    }
  }
}

function Stats(
  target: Object,
  key: string | symbol,
  descriptor: PropertyDescriptor
) {

if(!target.hasOwnProperty("__stats")){
  Object.defineProperty(target, "__stats", {
    value: {},
  })
}

const newDescriptor = {...descriptor }
const previousValue = descriptor.value;

(target as any).__stats[key] = {callAmount: 0, argsData: {}}
getParamNames(previousValue).forEach((param:string)=>{
  (target as any).__stats[key].argsData[param] = 0
})

newDescriptor.value = (...args: any[]) => {
  const methodData = (target as any).__stats[key]
  methodData.callAmount = ++methodData.callAmount;
  Object.keys(methodData.argsData).forEach((key,index)=>{
    (args[index] !== undefined) && (methodData.argsData[key] = ++methodData.argsData[key])
  })
  return previousValue(...args)
}
return newDescriptor
}

/**
 * 
 * @param (param1, param2, param3) => {}
 * @returns [param1, param2, param3]
 */
function getParamNames(func: Function): string[] {
  let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  let ARGUMENT_NAMES = /([^\s,]+)/g;
  let fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let  result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null) {
     return [];
  }
  return result;
}

class SomeClass { 
  public year!: number;

  public project!: string;
  
  @Stats
  public method0(test?:string, t?:number, z?:string, y?:string, ...args:any[]) {
  }

  @Stats
  public method1(param1?: number, param2?: number, param3?: number) {
  }

  @Stats
  public method2(param1:number, param2?:number) {
  }  
}

const s = new SomeClass();
const t = new SomeClass();

s.method0('test',1)
s.method0('test',1,'3')
s.method0('test',1, 'asd','asdfadf')
s.method0('test',1, 'zxcvx')
s.method0('test',1, 'f','ff', 'f',3,4,5,2,3)

s.method1(1,2,3)
s.method1(1,2)
s.method1(1)
s.method1(1,2)
s.method1(1,2,3)

s.method2(1,2)
s.method2(1,2)
s.method2(1,2)
s.method2(1,2)
s.method2(1,2)


t.method0('test',1)
t.method0('test',1,'3')
t.method0('test',1, 'asd','asdfadf')
t.method0('test',1, 'zxcvx')
t.method0('test',1, 'f','ff', 'f',3,4,5,2,3)

t.method1(1,2,3)
t.method1(1,2)
t.method1(1)
t.method1(1,2)
t.method1(1,2,3)

t.method2(1,2)
t.method2(1,2)
t.method2(1,2)
t.method2(1,2)
t.method2(1,2)


