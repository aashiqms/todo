// Django built in js function for handling csrf request to api's

		function getCookie(name) {
		    let cookieValue = null;
		    if (document.cookie && document.cookie !== '') {
		        let cookies = document.cookie.split(';');
		        for (let i = 0; i < cookies.length; i++) {
		            let cookie = cookies[i].trim();
		            // Does this cookie string begin with the name we want?
		            if (cookie.substring(0, name.length + 1) === (name + '=')) {
		                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		                break;
		            }
		        }
		    }
		    return cookieValue;
		}
		let csrftoken = getCookie('csrftoken');

// .....................................................................................................................

		let activeItem = null
		let list_snapshot = []

// A function to list all tasks from task-list api

		buildList()

		function buildList(){
			let wrapper = document.querySelector('.list_all')
			let url = '/api/task-list/';

			fetch(url)
			.then((resp) => resp.json())
			.then(function(data){
				console.log('Data:', data)

				let list = data;
				list.forEach((element, i) => {
					try{
						document.getElementById(`data-row-${i}`).remove()
					}catch(err){

					}
					let title = `<input type="checkbox" id="checkbox"><span class="title">${list[i].title}</span>`
					if (list[i].completed === true){
						title = `<span class="title" style="text-decoration: line-through;color: grey;">${list[i].title}</span>`
					}
					let item = `
						<div id="data-row-${i}">
						<li class="item">
<!--        <label for="check__box">-->
          <span class="check__box">
          <span class="item_title">${title}</span>
<!--        </label>-->
        <i class="fas fa-edit item__trash-can edit"></i>
        <i class="fas fa-trash-alt item__trash-can delete"></i>
        
      </li>
</div>
					`
					wrapper.innerHTML += item

				})
				if (list_snapshot.length > list.length){
					for (let i = list.length; i < list_snapshot.length; i++){
						document.getElementById(`data-row-${i}`).remove()
					}
				}

				list_snapshot = list;

				list.forEach((element, i) => {
					let editBtn = document.getElementsByClassName('edit')[i]
					let deleteBtn = document.getElementsByClassName('delete')[i]
					let title = document.getElementsByClassName('title')[i]

					editBtn.addEventListener('click', (function(item){
						return function(){
							editItem(item)
						}
					})(list[i]))

					deleteBtn.addEventListener('click', (function(item){
						return function(){
							deleteItem(item)
						}
					})(list[i]))

					title.addEventListener('click', (function(item){
						return function(){
							strikeTask(item)
						}
					})(list[i]))
				})

			})
		}
// .....................................................................................................................

		let form = document.querySelector('#form')
		form.addEventListener('submit', function(e){
			e.preventDefault();
			console.log('Form submitted');
			let url = '/api/task-create/';
			if (activeItem != null){
				const url_update = `/api/task-update/${activeItem.id}`;
				let title = document.querySelector('#title').value;
				const settings = {
				method:'POST',
				headers:{
					'Content-type':'application/json',
					'X-CSRFToken':csrftoken,
				},
				body:JSON.stringify({'title':title})
			}
				fetch(url_update, settings)
					.then(function(response){
					buildList()
					document.querySelector('#form').reset()
			})
				activeItem = null;
			} else {
				let title = document.querySelector('#title').value
			const settings = {
				method:'POST',
				headers:{
					'Content-type':'application/json',
					'X-CSRFToken':csrftoken,
				},
				body:JSON.stringify({'title':title})
			}
			fetch(url, settings)
					.then(function(response){
					buildList()
					document.querySelector('#form').reset()
			})
			}



		})

		function editItem(item){
			console.log('Item clicked:', item)
			activeItem = item
			document.querySelector('#title').value = activeItem.title
		}


		function deleteItem(item){
			console.log('Delete clicked')
            console.log(`${item.id}`)
			const settings = {
				method:'DELETE',
				headers:{
					'Content-type':'application/json',
					'X-CSRFToken':csrftoken,
				}
			}
			fetch(`api/task-delete/${item.id}`, settings)
						.then((response) => {
						buildList();
			});
		}

// Function to Strikedown completed tasks

function strikeTask(item){
			let task_id = `${item.id}`
			console.log('Strike clicked')

			item.completed = !item.completed

	const url = '/api/task-update/' +task_id;
			fetch(url, {
				method:'POST',
				headers:{
					'Content-type':'application/json',
					'X-CSRFToken':csrftoken,
				},
				body:JSON.stringify({'title':item.title, 'completed':item.completed})
			}).then((response) => {
				buildList()
			})
		}


