		/*
Django builtin function for csrf token usage in forms
		*/
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

// Creating a asynnchronous function for listing all Todos using 'task-list' api

const listTodos = async () => {
    const response = await fetch('api/task-list/');
    let wrapper = document.querySelector('.wrapper');
    wrapper.innerHTML = ''

    if(response.status !== 200){
        throw new Error('cannot fetch data, probably wrong api url(Error Code 200');
    }
    const data = await response.json();
    console.log(data);
    for(let index in data){
        let item = `<p>${data[index].title}`
        wrapper.innerHTML += item
    }
    return data;

};
listTodos();

// Creating a asynnchronous function for Creating Todos using 'task-create' api

const createTodos = async () => {
  let form = document.querySelector('#newItem')


        form.addEventListener('submit', function (e) {
            e.preventDefault()
            console.log('Form Submitted')
            let url = '/api/task-create/'
            let title = document.querySelector('.title').value

            let settings = {
              method: 'POST',
              headers:{
                  'Content-type': 'application/json',
                  'X-CSRFToken': csrftoken
              },
              body:JSON.stringify({'title':title})


          }

          fetch(url, settings)
          .then(function(response){
              listTodos()
              document.querySelector('.newItem').reset()
          })   

        })   
}

createTodos()
.catch(e => {
  console.log('There has been a problem with your fetch operation: ' + e.message);
});




























// listTodos()
//     .then(data => console.log('promise resolved for task-list api', data))
//     .catch(err => console.log('promise rejected for task-list api', err.message));

// // Ending for Listing of Todo items


// const addTask = document.querySelector('.newItem')
// addToyForm.addEventListener('submit', function (event) {
//   fetch(`api/task-create/`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-CSRFToken':csrftoken,
//     },
//     body: JSON.stringify({
//       'title': title
//     })
//   })

//   let promise = new Promise()
//     // .then(resp => resp.json())
//     // .then(listTodo())
// })