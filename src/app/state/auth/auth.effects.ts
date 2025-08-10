import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthEffects {
  loginRequest$;
  registrationRequest$;

  constructor(
    private actions$: Actions,
    private authService: AuthService,
  ) {
    this.loginRequest$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginRequest),
        map((action) => action.user),
        map((user) => {
          return (this.authService.login(user)) ? 
              AuthActions.loginSuccess({ user }) :
              AuthActions.loginFailure({ error: 'שגיאה בהתחברות' });
          }
      )
    )
  );

    this.registrationRequest$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.registrationRequest),
        map((action) => action.user),
        map((user) => {
          return (this.authService.register(user)) ?
            AuthActions.registrationSuccess({ user }) : 
            AuthActions.registrationFailure({error: 'משתמש כבר קיים במערכת'});
        })
      )
    );
  }
}
