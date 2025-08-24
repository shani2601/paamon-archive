import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../services/auth.service';
import { AUTH_MESSAGES } from "../../components/auth/auth-messages.consts";

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
                    error: AUTH_MESSAGES.LOGIN.WRONG_DETAILS,
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
                    error: AUTH_MESSAGES.REGISTER.ERROR_MESSAGES.EXISTING_USER,
                  })
            )
          )
        )
      )
    );
  }
}
