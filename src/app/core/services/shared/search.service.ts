import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public searchQuery = new BehaviorSubject<any>({ searchFilter: null });
  public currentsearchQuery = this.searchQuery.asObservable();

  constructor() {}

  public sendSearchQuery(searchQueryData: any) {
    this.searchQuery.next({ searchQueryData });
  }
}
