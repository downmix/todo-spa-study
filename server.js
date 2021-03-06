/*------------------------------------*/
/* [ API 처리 ] */
/* [ Node + Express ] */
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const data = require('./data')

const app = express()
const jsonMiddleware = bodyParser.json()

/*------------------------------------*/
/* [ PWT 로그인선언 ] */
const jwt = require('jsonwebtoken') //JWT의 생성과 검증을 위한 패키지 
const expressJwt = require('express-jwt') //JWT가 요청에 포함되어 서버에 들어왔을 때, 해당 토큰을 검증 및 변환해서 `req.user`에 저장해주는 express 미들웨어

const SECRET = 'appsecretkey' //토큰 서명의 서버 비밀 키
const authMiddleware = expressJwt({secret: SECRET}) //인증 미들웨어

const users = [
  {
    id: 'user',
    name: '사용자1',
    password: '1234',
  },
  {
    id: 'vezzita',
    name: '김민영',
    password: '1234'
  },
  {
    id: 'jm322',
    name: '임옥택',
    password: '1q2w3e'
  }
]

app.use(morgan('tiny'))
app.use(express.static('public'))

/*------------------------------------*/
/* [ todo 리스트 전달 ] */
app.get('/api/todos', (req, res) => {
  res.send(data.todoList())
})

/*------------------------------------*/
/* [ todo 신규추가 ] */
app.post('/api/todos', jsonMiddleware, authMiddleware, (req, res) => {
  console.log(req.user, '<< [ req.user ]');
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
/* [ 전체/완료 항목 보기 전환 ] */
app.get('/api/todos/completed', (req, res) => {
  // console.log(data.todoList())
  const completed = data.todoList().filter(item => item.complete === true)
  // console.log(completed)
  res.send(completed)
})

/*------------------------------------*/
/* [ todo id >> 수정 ] */
app.patch('/api/todos/:id', jsonMiddleware, authMiddleware, (req, res) => {
  let id;
  try {
    id = parseInt(req.params.id)
  } catch (e) {
    res.status(400)
    res.end()
    return // 바로 라우트 핸들러를 종료합니다.
  }
  console.log(req.body, '<< [ req.body ]');
  const todo = data.updateTodo(id, req.body)
  res.send(todo)
})

/*------------------------------------*/
/* [ todo id >> 삭제 ] */
app.delete('/api/todos/:id', jsonMiddleware, authMiddleware, (req, res) => {
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

/*------------------------------------*/
/* [ 로그인 인증 ] */
app.post('/api/login', jsonMiddleware, (req, res) => {
  console.log(req.body, '<< [ req.body ]')
  const {id, password} = req.body
  const findUser = users.find(user => {
    return user.id === id && user.password === password
  })
  
  if(findUser){
    const token = jwt.sign({id}, SECRET)
    res.send({
      ok: true,
      id: findUser.id,
      name: findUser.name,
      token
    })
  }else{
    res.status(400)
    res.send({
      ok: false,
    })
  }
})

/*------------------------------------*/
/* [ 로그인 검증 ] */
app.get('/api/auth', jsonMiddleware, authMiddleware, (req, res) => {
  res.send(req.user)
})

app.listen(3000, () => {
  console.log('listening...')
})