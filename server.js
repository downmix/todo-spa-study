/*------------------------------------*/
/* [ API 처리 ] */
/* [ Node + Express ] */
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const data = require('./data')

const app = express()
const jsonMiddleware = bodyParser.json()

app.use(morgan('tiny'))
app.use(express.static('public'))

/*------------------------------------*/
/* [ todo 리스트 전달 ] */
app.get('/api/todos', (req, res) => {
  res.send(data.todos)
})

/*------------------------------------*/
/* [ todo 신규추가 ] */
app.post('/api/todos', jsonMiddleware, (req, res) => {
  const {title, label, time} = req.body
  if (title) {
    const todo = data.addTodo({title, label, time})
    res.send(todo)
  } else {
    res.status(400)
    res.end()
  }
})

/*------------------------------------*/
/* [ todo id >> 수정 ] */
app.patch('/api/todos/:id', jsonMiddleware, (req, res) => {
  let id;
  try {
    id = parseInt(req.params.id)
  } catch (e) {
    res.status(400)
    res.end()
    return // 바로 라우트 핸들러를 종료합니다.
  }
  const todo = data.updateTodo(id, req.body)
  res.send(todo)
})

/*------------------------------------*/
/* [ todo id >> 삭제 ] */
app.delete('/api/todos/:id', jsonMiddleware, (req, res) => {
  let id;
  try {
    id = parseInt(req.params.id)
  } catch (e) {
    res.status(400)
    res.end()
    return // 바로 라우트 핸들러를 종료합니다.
  }
  data.deleteTodo(id)
  res.end()
})

app.listen(3000, () => {
  console.log('listening...')
})