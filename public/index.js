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
            e.srcElement.checked = !e.srcElement.checked //체크취소
            if(err.response.status === 401){
              statusInfo('할일체크 하기 위해서는 로그인이 필요합니다');
            }
          })
        })

        // 삭제 아이콘 클릭시
        // 비관적 업데이트
        const removeLink = todoItem.querySelector('.todo-remove')
        removeLink.addEventListener('click', e => {
          authedAxios.delete(`/api/todos/${id}`).then(res => {
            loadTodos()
          }).catch(err => {
            if(err.response.status === 401)
              statusInfo('삭제 하기 위해서는 로그인이 필요합니다');
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
        form.elements.title.value = null
      })
      .catch(err => {
        if(err.response.status === 401)
          statusInfo('등록 하기 위해서는 로그인이 필요합니다');
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
      .catch(err => {
        if(err.response.status === 400)
          statusInfo('로그인 실패!');
      })
  })

  loadTodos()
  loginArea()

})(window, document)

/*------------------------------------*/
/* [ JWT 인증 클라이언트 선언  ] */
let user;
let authedAxios = axios.create({
  headers: {
    'Authorization': `Bearer ${sessionStorage.getItem('my-todo-app-token')}`
  }
})

/*------------------------------------*/
/* [ logout >> 새로고침 ] */
const logoutBtn = () => {
  sessionStorage.removeItem('my-todo-app-token')
  sessionStorage.removeItem('my-todo-app')
  location.href = '/'
}

/*------------------------------------*/
/* [ 에러 안내 처리 ] */
const statusInfo = msg => {
  const infoEl = document.createElement('h3')
  infoEl.textContent = msg
  document.querySelector('#status-info').appendChild(infoEl);

  (setTimeout(function() {
    infoEl.textContent = ''
  }, 3000));
}