/*
Задание 3.
Реализовать декоратор свойства.
Декоратор на вход принимает функцию-условие. 
Если полученное значение удовлетворяет условию, то присвоить его свойству

Класс Person изменять нельзя.
Функции-условия: isInteger, isEqualToString, isOneOf
*/

function validateProperty(condition: (...args:any[])=>boolean){
  return function (target: any,  propertyKey: string) {
    const setter = function(value:any) {
      if(condition(value)){
        this[`_${propertyKey}`] = value
        return value;
      }
    }

    const getter = function() {
      return this[`_${propertyKey}`]
    }

    if(delete target[propertyKey]) {
      Object.defineProperty(target, propertyKey,{
        get: getter,
        set: setter
      })
    }
  }
}


const isInteger = (value: any) => {
  return Number.isInteger(value)
}

const isEqualToString = (compareString: string) => (value:string) => {
  return compareString === value;
}

const isOneOf = (availableValue: any[]) => (value:any) => {
  return availableValue.includes(value);
}

class Person { 
  @validateProperty(isInteger)
  public year!: number;

  @validateProperty(isEqualToString('Союз'))
  public project!: string;
  
  @validateProperty(isOneOf(["Кирилл", "Cева", "Гриша", 'Андрей']))
  public name!: string
  
}

const p = new Person();
const p2 = new Person();


p.project = 'Союз';
p.project = 'DBOX';
p.project = 'SADO';

p2.name = 'Леша';
p2.name = 'Андрей';
p2.name = 'Cева';
p2.name = 'Artem yo';


console.log(p.project);
console.log(p2.project);
console.log(p2.name);
