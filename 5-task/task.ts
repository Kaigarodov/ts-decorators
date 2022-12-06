import fetch from 'node-fetch'
/*
  Задача 5.
  Пишем декоратор класса ModelByUrl.
  Задача заключается в том, чтобы при передачи ссылки на источник данных в конструктор, выполнялся запрос.
  Запрос выполняем с помощью fetch (уже импортирован).
  После получения ответа экземпляр класса заполняется данными, используется метод fromDto.
  Также, чтобы оповестить пользователя о результате выполнения класс содержит свойство onInit.
  
  Главная задач - последняя строчка должна работать)
*/

interface IModel<T>  {
  fromDto: (data: any)=>void;
  onInit: Promise<ModelResult<T>>;
}

interface ITodoResponse {
  userId: number,
  id: number,
  title: string,
  completed: false
}

type ModelResult<T> = {success:boolean, value: T | undefined }

function ModelByUrl<T extends IModel<T>>(constructor: new (url:string)=> T){
  return function (url: string) {
    let inst = new constructor(url);
    inst.onInit = new Promise((resolve, reject)=>{
      fetch(url).then(res=>{
        return res.json()
      }).then(data=>{
        inst.fromDto(data);
        resolve({success:true, value: inst});
      }).catch((e)=>{
        resolve({success:false, value: inst});
      })
    })
    return inst;
  } as any;
}

@ModelByUrl
class Test implements IModel<Test> {
  public onInit!: Promise<ModelResult<Test>>;
  public userId!: number;
  public id!: number;
  public title!: string;
  public completed!: boolean;

  constructor(url: string) {}

  public fromDto(data: ITodoResponse) {
    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title;
    this.completed = data.completed;
  }
}

//https://jsonplaceholder.typicode.com/todos/[1,2,3 ...]
new Test('https://jsonplaceholder.typicode.com/todos/1').onInit.then((result)=> {console.log(result.value?.userId)})