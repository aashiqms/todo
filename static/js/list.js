		/*
			KEY COMPONENTS:
			"activeItem" = null until an edit button is clicked. Will contain object of item we are editing
			"list_snapshot" = Will contain previous state of list. Used for removing extra rows on list update

			PROCESS:
			1 - Fetch Data and build rows "buildList()"
			2 - Create Item on form submit
			3 - Edit Item click - Prefill form and change submit URL
			4 - Delete Item - Send item id to delete URL
			5 - Cross out completed task - Event handle updated item

			NOTES:
			-- Add event handlers to "edit", "delete", "title"
			-- Render with strike through items completed
			-- Remove extra data on re-render
			-- CSRF Token
		*/
        			//wrapper.innerHTML = ''
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

		list_function()

			function list_function(){
			let wrapper = document.querySelector('.wrapper')
                wrapper.innerHTML = ''
			let url = '/api/task-list/'

			fetch(url)
			.then((response) => response.json())
			.then(data => {
				console.log('Data:', data)

				let list = data
				for (let i in list){
                    let item = `
                    <li class="todo todo__item">
        <input type="checkbox" id="todo-${i}">
        <label for="todo-${i}">
          <span class="check__box">
            <i class="far fa-check check__pointer"></i>
          </span>
          <span class="item__title">${list[i].title} <i class="fas fa-edit item__edit" ></i></i></span>
          
        </label>
        
        
        <i class="fas fa-trash-alt item__trash-can"></i>  
      </li>
					`;
                    wrapper.innerHTML += item

				}

			})
		}


		let form = document.querySelector('#newTask')


        form.addEventListener('submit', function (e) {
            e.preventDefault()
            console.log('Form Submitted')
            let url = '/api/task-create/'
            let title = document.querySelector('.title').value

            fetch(url, {
                method: 'POST',
                headers:{
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body:JSON.stringify({'title':title})


            }).then(function (response) {
                list_function()
                document.querySelector('#newTask').reset()

            })

        })
        
        function editItem() {
		    console.log('item clicked')

        }
