// External Libraries
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, exhaustMap } from 'rxjs/operators';

// Actions
import * as MilesAction from '@pages/miles/state/actions/miles.actions';

// Services
import { MilesService } from 'appcoretruckassist';
  

@Injectable()
export class MilesEffects {
  constructor(
    private actions$: Actions,
    private milesService: MilesService
  ) {}

  public loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MilesAction.getLoadsPayload),  
      exhaustMap(() =>  
        this.milesService.apiMilesListGet().pipe(  
          map((response) => {
            return MilesAction.getLoadsPayloadSuccess({ params: response });  
          }),
          catchError((error) => {
            return of(MilesAction.getLoadsPayloadError({ error })); 
          })
        )
      )
    )
  );
}
