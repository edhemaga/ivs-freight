import { Injectable } from '@angular/core';

import { flatMap, Observable, tap } from 'rxjs';

// store
import { TodoStore } from '@pages/to-do/state/to-do.store';

// services
import { FormDataService } from '@shared/services/form-data.service';

// models
import {
    TodoListResponse,
    TodoModalResponse,
    TodoResponse,
    TodoService as TodoBackendService,
    TodoStatus,
    UpdateTodoStatusCommand,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class TodoService {
    constructor(
        private todoService: TodoBackendService,
        private todoStore: TodoStore,
        private formDataService: FormDataService
    ) {}

    public getTodoList(
        status?: TodoStatus,
        companyUserId?: Array<any>,
        departmentId?: Array<any>,
        dateFrom?: string,
        dateTo?: string,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<TodoListResponse> {
        return this.todoService.apiTodoListGet(
            status,
            companyUserId,
            departmentId,
            dateFrom,
            dateTo,
            pageIndex,
            pageSize,
            companyId,
            sort,
            null,
            null,
            search,
            search1,
            search2
        );
    }

    public updateTodoItem(
        todo: UpdateTodoStatusCommand
    ): Observable<TodoListResponse> {
        return this.todoService.apiTodoStatusPut(todo);
    }

    public updateTodo(data: any) {
        this.formDataService.extractFormDataFromFunction(data);
        return this.todoService.apiTodoPut().pipe(
            flatMap(() => {
                return this.getTodoById(data.id);
            }),
            tap((todo) => (this.updateTodoList = todo))
        );
    }

    public addTodo(data: any) {
        this.formDataService.extractFormDataFromFunction(data);
        return this.todoService.apiTodoPost().pipe(
            flatMap((param) => {
                return this.getTodoById(param.id);
            }),
            tap((todo) => (this.updateTodoList = todo))
        );
    }

    public deleteTodoById(id: number): Observable<any> {
        return this.todoService.apiTodoIdDelete(id);
    }

    public getTodoById(id: number): Observable<TodoResponse> {
        return this.todoService.apiTodoIdGet(id);
    }

    public getTodoDropdowns(): Observable<TodoModalResponse> {
        return this.todoService.apiTodoModalGet();
    }

    set updateTodoList(todo) {
        this.todoStore.update((store) => ({
            ...store,
            todoList: [
                ...store.todoList.slice(0, todo.status.id).map((item) => {
                    item.pagination.data.push(todo);
                    return item;
                }),
                ...store.todoList.slice(todo.status.id),
            ],
        }));
    }

    set setTodoList(response) {
        this.todoStore.update((store) => ({
            ...store,
            todoList: response,
        }));
    }
}
