import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  loginRequest$;
  navigateOnLoginSuccess$;
  registrationRequest$;
  navigateOnRegistrationSuccess$;

  constructor(private router: Router, private actions$: Actions, private authService: AuthService) {
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

    this.navigateOnLoginSuccess$ = createEffect(() =>
        this.actions$.pipe(
          ofType(AuthActions.loginActions.success),
          tap(() => this.router.navigate(['/home']))
        ), { dispatch: false }
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

    this.navigateOnRegistrationSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.registrationActions.success),
        delay(1500),
        tap(() => this.router.navigate(['/login']))
      ), { dispatch: false }
    );
  }
}
