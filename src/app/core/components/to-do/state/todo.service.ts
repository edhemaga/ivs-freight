import { TodoService } from './../../../../../../appcoretruckassist/api/todo.service';
import { TodoListResponse } from './../../../../../../appcoretruckassist/model/todoListResponse';
import { Injectable } from '@angular/core';
import { flatMap, Observable } from 'rxjs';
import { TodoStore } from './todo.store';
import { CreateTodoCommand } from 'appcoretruckassist/model/createTodoCommand';
import {
  TodoModalResponse,
  TodoResponse,
  TodoStatus,
  UpdateTodoStatusCommand,
} from 'appcoretruckassist';
import { getFunctionParams } from 'src/app/core/utils/methods.globals';

@Injectable({
  providedIn: 'root',
})
export class TodoTService {
  constructor(private todoService: TodoService, private todoStore: TodoStore) {}

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

  //UpdateTodoCommand
  public updateTodo(data: any) {
    const sortedParams = getFunctionParams(this.todoService.apiTodoPut, data);
    return this.todoService
      .apiTodoPut(...sortedParams)
      .pipe(
        flatMap((param) => {
          return this.getTodoById(data.id);
        })
      )
      .subscribe((todo) => {
        this.updateTodoList = todo;
      });
  }

  //CreateTodoCommand
  public addTodo(data: CreateTodoCommand) {
    const sortedParams = getFunctionParams(this.todoService.apiTodoPost, data);
    return this.todoService
      .apiTodoPost(...sortedParams)
      .pipe(
        flatMap((param) => {
          return this.getTodoById(param.id);
        })
      )
      .subscribe((todo) => {
        this.updateTodoList = todo;
      });
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
