/* 
Задание 1. 
Реализовать декоратор класса, который предотвратит дальнейшее добавление/изменение функций класса.
*/
function PreventExtensions<T extends {new (...args: any[]): object}>(target: T):void{
    Object.seal(target);
    Object.seal(target.prototype);
}
 
@PreventExtensions
class User {
    name: string;
    constructor(name: string){
        this.name = name;
    }
    print():void{
        console.log(this.name);
    }
}

const u = new User('Test')
u.name = 'AAAA'