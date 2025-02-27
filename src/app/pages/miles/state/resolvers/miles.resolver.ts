import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { filter, take, withLatestFrom } from 'rxjs/operators'; 
import { MilesState } from '../reducers/miles.reducer';
import { getMilesListSelector, selectMilesLoading } from '../selectors/miles.selectors';

@Injectable({
  providedIn: 'root',
})
export class LoadResolver {
  constructor(private store: Store<MilesState>) {}

  public resolveInitialData$: Observable<any> = this.store.pipe(
    select(selectMilesLoading),  
    filter((loading) => !loading),  
    withLatestFrom(this.store.pipe(select(getMilesListSelector))),  
    filter(([loading, items]) => !!items),  
    take(1)  
  );
}
