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
          axios.patch(`/api/todos/${id}`, {
            complete: e.currentTarget.checked
          }).then(res => {
            loadTodos()
          })
        })

        // 삭제 아이콘 클릭시
        // 비관적 업데이트
        const removeLink = todoItem.querySelector('.todo-remove')
        removeLink.addEventListener('click', e => {
          axios.delete(`/api/todos/${id}`).then(res => {
            loadTodos()
          })
        })
      })
    })
  }

  document.querySelector('#todo-form').addEventListener('submit', e => {
    e.preventDefault()
    //form submit 기본동작을 취소 (페이지 이동)
    //e.stopPropagation()
    //이벤트 버블링 중단
    const form = e.currentTarget

    //라벨 기능 추가
    const labelArray = form.elements.label
    const checkedLabelArray = []
    
    for(let i = 0; i < labelArray.length; i++) {
      if(labelArray[i].checked) checkedLabelArray.push(labelArray[i].value)
    }
    
    axios.post('/api/todos', {
      title: form.elements.title.value,
      label: checkedLabelArray
    })
      .then(loadTodos)
      .then(() => {
        form.elements.title.value = null
        for(let i = 0; i < labelArray.length; i++) {
          labelArray[i].checked = false
        }
    })
  })

  loadTodos()

})(window, document)