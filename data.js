/*------------------------------------*/
/* [ 데이터 관리 ] */
let todoSeq = 1
const todos = [
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
]

/*------------------------------------*/
/* [ todos추가 ] */
function addTodo({title, label}) {
  const newTodo = {
    id: todoSeq++,
    title,
    complete: false,
    label
  }
  todos.push(newTodo)
  return newTodo
}

/*------------------------------------*/
/* [ Todo update ] */
function updateTodo(id, source) {
  const todo = todos.find(item => item.id === id)
  if (todo) {
    Object.assign(todo, source)
    return todo
  } else {
    throw new Error('해당 id를 갖는 요소가 없습니다.')
  }
}

/*------------------------------------*/
/* [ Todo 삭제 ] */
function deleteTodo(id) {
  const index = todos.findIndex(item => item.id === id)
  if (index !== -1) {
    todos.splice(index, 1)
  }
}

/*------------------------------------*/
/* [ 모듈 호출 가능하도록 선언 ] */
module.exports = {
  todos,
  addTodo,
  updateTodo,
  deleteTodo
}