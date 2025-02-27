import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, exhaustMap } from 'rxjs/operators';
import * as MilesAction from '../actions/miles.actions';
import { MilesService } from 'appcoretruckassist';  // Tvoj servis za API pozive

@Injectable()
export class MilesEffects {
  constructor(
    private actions$: Actions,
    private milesService: MilesService
  ) {}

  loadItems$ = createEffect(() =>
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
