/*------------------------------------*/
/* [ lowDB 환경 구성 ] */
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

/*------------------------------------*/
/* [ 데이터 관리 ] */
const todoIdList = db.get('todos').value().map(val => val.id)
console.log(todoIdList, '<< [ todoIdList ]');
let todoSeq = Math.max(...todoIdList);
if(todoSeq < 1){
  todoSeq = 0;
}
/*const todos = [
  {
    id: todoSeq++,
    title: "sample todo",
    complete: false,
    label: "회사"
  },
  {
    id: todoSeq++,
    title: "completed todo",
    complete: true,
    label: "회사"
  }
]*/

/*------------------------------------*/
/* [ todo 전체리스트 ] */
function todoList(){
  return db.get('todos').value();
}

/*------------------------------------*/
/* [ todos추가 ] */
function addTodo({title, label, time}) {
  const newTodo = {
    id: ++todoSeq,
    title,
    complete: false,
    label,
    time
  }

  db.get('todos')
    .push(newTodo)
    .write()
  //todos.push(newTodo)
  return newTodo
}

/*------------------------------------*/
/* [ Todo update ] */
function updateTodo(id, source) {
  const todo = db.get('todos')
    .find({ id: id })
    .value()

  if (todo) {
    db.get('todos')
      .find({ id: id })
      .assign(source)
      .write()
    return todo
  } else {
    throw new Error('해당 id를 갖는 요소가 없습니다.')
  }
}

/*------------------------------------*/
/* [ Todo 삭제 ] */
function deleteTodo(id) {
  db.get('todos')
    .remove({ id: id })
    .write()

  /*const index = todos.findIndex(item => item.id === id)
  if (index !== -1) {
    todos.splice(index, 1)
  }*/
}

/*------------------------------------*/
/* [ 모듈 호출 가능하도록 선언 ] */
module.exports = {
  todoList,
  addTodo,
  updateTodo,
  deleteTodo
}