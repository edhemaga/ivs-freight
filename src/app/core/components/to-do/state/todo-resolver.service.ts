import { TodoQuery } from './todo.query';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TodoTService } from './todo.service';

@Injectable({
  providedIn: 'root',
})
export class TodoResolverService implements Resolve<any> {
  constructor(
    private todoService: TodoTService,
    private todoQuery: TodoQuery
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (this.todoQuery.todoGetTodoList.todayObject) {
      return this.todoQuery.todoGetTodoList;
    } else {
      return this.todoService.getTodoList().pipe(
        tap((products) => {
          this.todoService.setTodoList = products;
        })
      );
    }
  }
}
