import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TodoResponse } from 'appcoretruckassist';

export interface TodoState extends EntityState<TodoResponse[], number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'todo' })
export class TodoStore extends EntityStore<TodoState> {
  constructor() {
    super();
  }
}