import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthEffects {
  loginRequest$;
  registrationRequest$;

  constructor(private actions$: Actions, private authService: AuthService) {
    this.loginRequest$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginActions.request),
        switchMap(({ user }) =>
          of(this.authService.login(user)).pipe(
            map((success) =>
              success
                ? AuthActions.loginActions.success({ user })
                : AuthActions.loginActions.failure({
                    error: 'אחד או יותר מהפרטים שהזנת שגויים',
                  })
            )
          )
        )
      )
    );

    this.registrationRequest$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.registrationActions.request),
        switchMap(({ user }) =>
          of(this.authService.register(user)).pipe(
            map((success) =>
              success
                ? AuthActions.registrationActions.success({ user })
                : AuthActions.registrationActions.failure({
                    error: 'משתמש כבר קיים במערכת',
                  })
            )
          )
        )
      )
    );
  }
}
