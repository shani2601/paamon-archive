import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthEffects {
  loginRequest$;
  registrationRequest$;

  constructor(private actions$: Actions, private authService: AuthService) {
    this.loginRequest$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginRequest),
        map((action) => action.user),
        map((user) => {
          const loginResult = this.authService.login(user);

          return loginResult
            ? AuthActions.loginSuccess({ user })
            : AuthActions.loginFailure({
                error: 'אחד מהפרטים שהזנת לא נכונים',
              });
        })
      )
    );

    this.registrationRequest$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.registrationRequest),
        map((action) => action.user),
        map((user) => {
          if (this.authService.register(user)) {
            return AuthActions.registrationSuccess({ user });
          } else {
            return AuthActions.registrationFailure({
              error: 'Username already exists',
            });
          }
        })
      )
    );
  }
}
