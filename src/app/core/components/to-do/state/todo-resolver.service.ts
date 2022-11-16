import { TodoQuery } from './todo.query';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
