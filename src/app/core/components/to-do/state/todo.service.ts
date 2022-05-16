import { TodoService } from './../../../../../../appcoretruckassist/api/todo.service';
import { TodoListResponse } from './../../../../../../appcoretruckassist/model/todoListResponse';
import { DriverService } from './../../../../../../appcoretruckassist/api/driver.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateTodoCommand } from 'appcoretruckassist';

@Injectable({
  providedIn: 'root',
})
export class TodoTService {
  constructor(private todoService: TodoService) {}

  // Create Driver
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

  public updateTodoItem(todo: UpdateTodoCommand): Observable<TodoListResponse>{
      return this.todoService.apiTodoPut(todo);
  }
}
