import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Injectable()
export class AuthEffects {
  loginRequest$;
  registrationRequest$;

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.loginRequest$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginRequest),
        map((action) => action.user),
        map((user) => {
          this.userService.loginUser(user);

          const loginResult = this.authService.login(user);

          switch (loginResult) {
            case 'success':
              return AuthActions.loginSuccess({ user });
            case 'wrong-username':
              return AuthActions.loginFailure({ error: 'שם משתמש לא נמצא' });
            case 'wrong-password':
              return AuthActions.loginFailure({ error: 'סיסמה לא נכונה' });
            default:
              return AuthActions.loginFailure({ error: 'שגיאה לא ידועה' });
          }
        })
      )
    );

    this.registrationRequest$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.registrationRequest),
        map((action) => action.user),
        map((user) => {
          this.userService.registerUser(user);

          if (this.authService.register(user)) {
            return (AuthActions.registrationSuccess({ user }));
          }
          else {
            return (AuthActions.registrationFailure({error: 'Username already exists'}));
          }
        })
      )
    );
  }
}
