import { Injectable } from '@angular/core';
import {
  CreateResponse,
  CreateTodoCommand,
  TodoModalResponse,
  TodoResponse,
  TodoService,
  UpdateTodoCommand,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskModalService {
  constructor(private taskService: TodoService) {}

  updateTask(data: UpdateTodoCommand): Observable<any> {
    return this.taskService.apiTodoPut(data);
  }

  addTask(data: CreateTodoCommand): Observable<CreateResponse> {
    return this.taskService.apiTodoPost(data);
  }

  deleteTaskById(id: number): Observable<any> {
    return this.taskService.apiTodoIdDelete(id);
  }

  getTaskById(id: number): Observable<TodoResponse> {
    return this.taskService.apiTodoIdGet(id);
  }

  getTaskDropdowns(): Observable<TodoModalResponse> {
    return this.taskService.apiTodoModalGet();
  }
}
