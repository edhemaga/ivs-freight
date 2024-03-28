import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';
import { TodoState, TodoStore } from './todo.store';

@Injectable({
    providedIn: 'root',
})
export class TodoQuery extends QueryEntity<TodoState> {
    selectTodoList$ = this.select('todoList');

    constructor(protected store: TodoStore) {
        super(store);
    }

    get todoGetTodoList() {
        return this.getValue().todoList;
    }
}
