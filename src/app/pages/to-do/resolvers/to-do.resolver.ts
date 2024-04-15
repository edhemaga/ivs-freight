import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin, Observable, map } from 'rxjs';

// store
import { TodoQuery } from '@pages/to-do/state/to-do.query';

// services
import { TodoService } from '@pages/to-do/services/to-do.service';

@Injectable({
    providedIn: 'root',
})
export class TodoResolver implements Resolve<any> {
    constructor(
        private todoService: TodoService,
        private todoQuery: TodoQuery
    ) {}
    resolve(): Observable<any> {
        if (this.todoQuery.todoGetTodoList.todayObject) {
            return this.todoQuery.todoGetTodoList;
        } else {
            const todoList = this.todoService.getTodoList('Todo');
            const ongoingList = this.todoService.getTodoList('InProgres');
            const doneList = this.todoService.getTodoList('Done');

            let todo = forkJoin([todoList, ongoingList, doneList]).pipe(
                map((list: any) => {
                    this.todoService.setTodoList = list;
                    return list;
                })
            );

            return todo;
        }
    }
}
