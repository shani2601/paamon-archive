import { Component, DestroyRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as AuthActions from "../../../state/auth/auth.actions";
import { User } from "../../../models/user.model";
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectLoginError, selectIsLoggedIn } from "../../../state/auth/auth.selectors";
import { AuthState } from "../../../state/auth/auth.reducer";
import { ROUTES } from "../../../routing/routing.consts";
import { AUTH_MESSAGES } from "../auth-messages.consts";
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-login',
    imports: [MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, ReactiveFormsModule, RouterLink],
    styleUrl: './login.component.css',
    templateUrl: './login.component.html'
})
export class LoginComponent {
  ROUTES = ROUTES;
  hide = true;
  loginForm: FormGroup;
  loginError: string | undefined;

  constructor(private store: Store<AuthState>, private router: Router, private formBuilder: FormBuilder, private destroyRef: DestroyRef) {
    this.loginForm = this.formBuilder.nonNullable.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.store.select(selectIsLoggedIn).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate([ROUTES.HOME.path]));

    this.store.select(selectLoginError).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(err => this.loginError = err ?? "");
  }

  ngOnDestroy() {
    this.store.dispatch(AuthActions.loginActions.reset());
  }

  isFieldNotEmpty(fieldName: string) {
    return (Boolean(this.loginForm.get(fieldName)?.value));
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginError = AUTH_MESSAGES.EMPTY_FORM_FIELDS;
      return;
    }

    const user: User = this.loginForm.value;
    this.store.dispatch(AuthActions.loginActions.request({user}));
  }
}