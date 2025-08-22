import { Component, inject, DestroyRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as AuthActions from "../../state/auth/auth.actions";
import { User } from "../../models/user.model";
import { Actions, ofType } from "@ngrx/effects";
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: true,
    selector: 'app-login',
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, ReactiveFormsModule, RouterLink],
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html'
})
export class LoginComponent {
  private store = inject(Store);

  loginForm: FormGroup;
  loginError: string | undefined;

  constructor(private formBuilder: FormBuilder, private actions$: Actions, private destroyRef: DestroyRef) {
    this.loginForm = this.formBuilder.nonNullable.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.actions$.pipe(ofType(AuthActions.loginActions.failure), takeUntilDestroyed(this.destroyRef))
      .subscribe(action => this.loginError = action.error);
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginError = "יש למלא את כל השדות";
      return;
    }

    const user: User = this.loginForm.value;
    this.store.dispatch(AuthActions.loginActions.request({user}));
  }
}