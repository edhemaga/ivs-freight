import { TodoService } from './../../../../../../appcoretruckassist/api/todo.service';
import { TodoListResponse } from './../../../../../../appcoretruckassist/model/todoListResponse';
import { Injectable } from '@angular/core';
import { flatMap, Observable } from 'rxjs';
import { TodoStore } from './todo.store';
import {
  CreateResponse,
  CreateTodoCommand,
  TodoModalResponse,
  TodoResponse,
  UpdateTodoCommand,
  UpdateTodoStatusCommand,
} from 'appcoretruckassist';

@Injectable({
  providedIn: 'root',
})
export class TodoTService {
  constructor(private todoService: TodoService, private todoStore: TodoStore) {}

  public getTodoList(
    title?: string,
    status?: string,
    pageIndex?: number,
    pageSize?: number,
    companyId?: number,
    sort?: string,
    search?: string,
    search1?: string,
    search2?: string
  ): Observable<TodoListResponse> {
    return this.todoService.apiTodoListGet(title, status, pageIndex, pageSize);
  }

  public updateTodoItem(
    todo: UpdateTodoStatusCommand
  ): Observable<TodoListResponse> {
    return this.todoService.apiTodoStatusPut(todo);
  }

  public updateTodo(data: UpdateTodoCommand): Observable<any> {
    return this.todoService.apiTodoPut(data);
  }

  public addTodo(data: CreateTodoCommand){
    return this.todoService.apiTodoPost(data).pipe(
      flatMap(param => {
        return this.getTodoById(param.id);
      })
    ).subscribe((todo) => {
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
      todoList: {
        ...store.todoList,
        pagination: {
          ...store.todoList.pagination,
          data: [...store.todoList.pagination.data, todo],
        },
      },
    }));
  }

  set setTodoList(response) {
    this.todoStore.update((store) => ({
      ...store,
      todoList: response,
    }));
  }
}
