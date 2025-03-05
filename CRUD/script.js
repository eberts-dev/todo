const todo = {
	action(e) {
		const target = e.target
		if (target.classList.contains('todo__action')) {
			const action = target.dataset.todoAction
			const elemItem = target.closest('.todo__item')
			if (action === 'deleted' && elemItem.dataset.todoState === 'deleted') {
				elemItem.remove()
			} else {
				elemItem.dataset.todoState = action
				const lexicon = {
					active: 'восстановлено',
					completed: 'завершено',
					deleted: 'удалено',
				}
				const elTodoDate = elemItem.querySelector('.todo__date')
				const html = `<span>${lexicon[action]}: ${new Date()
					.toLocaleString()
					.slice(0, -3)}</span>`
				elTodoDate.insertAdjacentHTML('beforeend', html)
				elTodoDate.innerHTML = '';
			}
			this.save()
		} else if (target.classList.contains('todo__add')) {
			this.add()
			this.save()
		}
	},

	add() {
		const elemText = document.querySelector('.todo__text')
		if (elemText.disabled || !elemText.value.length) {
			return
		}
		document
			.querySelector('.todo__items')
			.insertAdjacentHTML('beforeend', this.create(elemText.value))
			elemText.value = ''
	},

	create(text) {
		const date = JSON.stringify({
			add: new Date().toLocaleString().slice(0, -3),
		})
		return `<li class="todo__item" data-todo-state="active">
              <span class="todo__task">
							${text}
                <span class="todo__date" data-todo-date="${date}">
                  <span>добавлено: ${new Date()
										.toLocaleString()
										.slice(0, -3)}</span>
                </span>
              </span>
              <span class="todo__action todo__action_restore" data-todo-action="active"></span>
              <span class="todo__action todo__action_complete" data-todo-action="completed"></span>
              <span class="todo__action todo__action_delete" data-todo-action="deleted"></span>
            </li>`
	},

	init() {
		const fromStorage = localStorage.getItem('todo')
		if (fromStorage) {
			const data = JSON.parse(fromStorage)

			const todoItemsContainer = document.querySelector('.todo__items')
			todoItemsContainer.innerHTML = ''
		}
		document.querySelector('.todo__options').addEventListener('change', this.update)
		document.addEventListener('click', this.action.bind(this))
	},

	update() {
		const option = document.querySelector('.todo__options').value
		document.querySelector('.todo__items').dataset.todoOption = option
		document.querySelector('.todo__text').disabled = option !== 'active'
	},

	save() {
		const items = Array.from(document.querySelectorAll('.todo__item')).map(
			item => {
				return {
					text: item.querySelector('.todo__task').textContent,
					state: item.dataset.todoState,
					date: item.querySelector('.todo__date').textContent,
				}
			}
		)
		localStorage.setItem('todo', JSON.stringify(items))
	},
}

todo.init()
