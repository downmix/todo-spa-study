
let userId = '';
let userName = '';

(function (window, document) {
  /**
   * 서버에서 할일 템플릿과 할일 데이터를 가져온 후, #todos 요소 안에 렌더링하는 함수
   */
  function loadTodos() {
    console.log('start loadTodos')
    render({
      target: '#todos',
      templatePath: '/templates/todos.ejs',
      dataPath: '/api/todos'
    }).then(todosEl => {
      todosEl.querySelectorAll('.todo-item').forEach(todoItem => {
        const id = todoItem.dataset.id

        // 체크박스 클릭시
        // 낙관적 업데이트
        const checkboxEl = todoItem.querySelector('.todo-checkbox')
        checkboxEl.addEventListener('click', e => {
          authedAxios.patch(`/api/todos/${id}`, {
            complete: e.currentTarget.checked
          }).then(res => {
            loadTodos()
          }).catch(err => {
            if(err.response.status === 401){
              console.log(err.response, '<< [ err.response ]');
              statusInfo('할일체크 하기 위해서는 로그인이 필요합니다');
              
            }
            //console.log(err.response.status, '<< [ err ]');
          })
        })

        // 삭제 아이콘 클릭시
        // 비관적 업데이트
        const removeLink = todoItem.querySelector('.todo-remove')
        removeLink.addEventListener('click', e => {
          authedAxios.delete(`/api/todos/${id}`).then(res => {
            loadTodos()
          })
        })
      })
    })
  }

  function loginArea() {
    if(sessionStorage.getItem('my-todo-app-token')){
      render({
        target: '#login',
        templatePath: '/templates/login-ok.ejs',
        dataPath: '/api/auth'
      })
      .then((templat) => {
        authedAxios = axios.create({
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('my-todo-app-token')}`
          }
        })
  
        user = JSON.parse(sessionStorage.getItem('my-todo-app'))
        templat.querySelector("span#loginOkId").textContent = user.id
        templat.querySelector("span#loginOkName").textContent = user.name
      })
    }
  }

  document.querySelector('#todo-form').addEventListener('submit', e => {
    e.preventDefault()
    //form submit 기본동작을 취소 (페이지 이동)
    //e.stopPropagation()
    //이벤트 버블링 중단
    const form = e.currentTarget
    authedAxios.post('/api/todos', {
      title: form.elements.title.value
    })
      .then(loadTodos)
      .then(() => {
        //form.elements.title.value = null
      })
  })

  document.querySelector('#login-form').addEventListener('submit', e => {
    e.preventDefault()
    const form = e.currentTarget
    axios.post('/api/login', {
      id: form.elements.loginId.value,
      password: form.elements.loginPw.value
    })
      .then((res) => {
        const user = {
          id: res.data.id, 
          name: res.data.name
        }

        sessionStorage.setItem('my-todo-app-token', res.data.token)
        sessionStorage.setItem('my-todo-app', JSON.stringify(user))
        loginArea()
      })
  })

  loadTodos()
  loginArea()

})(window, document)

let user;
let authedAxios = axios.create({
  headers: {
    'Authorization': `Bearer ${sessionStorage.getItem('my-todo-app-token')}`
  }
})

const logoutBtn = () => {
  sessionStorage.removeItem('my-todo-app-token')
  sessionStorage.removeItem('my-todo-app')
  location.href = '/'
}

const statusInfo = msg => {
  //document.querySelector('#status-info').textContent = msg
  const infoEl = document.createElement('h3')
  infoEl.textContent = msg
  document.querySelector('#status-info').appendChild(infoEl);

  (setTimeout(function() {
    infoEl.textContent = ''
  }, 3000));
}