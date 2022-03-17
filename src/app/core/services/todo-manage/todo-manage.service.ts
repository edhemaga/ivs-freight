import {EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TodoManageService {

  public task = new Subject<void>();
  public updateTask = new Subject<void>();
  public taskDel = new Subject<void>();
  public emitTodo: EventEmitter<boolean> = new EventEmitter();
  public closeTodoTogglers: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient) {
  }

  createTodoTask(task) {
    return this.http.post(environment.API_ENDPOINT + 'todo', task);
  }

  listTodoTasks() {
    return this.http.get(environment.API_ENDPOINT + `todo/list/all/1/${environment.perPage}`);
  }

  deleteTaskItem(taskId) {
    return this.http.delete(environment.API_ENDPOINT + `todo/${taskId}`);
  }

  getTaskById(id) {
    return this.http.get(environment.API_ENDPOINT + `todo/${id}/all`);
  }

  updateTodo(id, data) {
    return this.http.put(environment.API_ENDPOINT + `todo/${id}`, data);
  }

  /** To-do comment api */
  getSingleTodoCommentsList(todoId) {
    return this.http.get(environment.API_ENDPOINT + `todo/comment/list/id/${todoId}` + '/' + environment.page + '/' + environment.perPage);
  }

  createComment(comment) {
    return this.http.post(environment.API_ENDPOINT + `todo/comment/${comment.entityId}`, comment);
  }

  deleteComment(id) {
    return this.http.delete(environment.API_ENDPOINT + `todo/comment/id/${id}`);
  }

  updateComment(id, comment) {
    return this.http.put(environment.API_ENDPOINT + `todo/comment/id/${id}`, comment);
  }


}
