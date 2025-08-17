import { Component, inject, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as AuthActions from "../../state/auth/auth.actions";
import { User } from "../../models/user.model";
import { Actions, ofType } from "@ngrx/effects";
import { Subject, takeUntil } from "rxjs";
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-login',
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, ReactiveFormsModule, RouterLink],
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnDestroy{
  private destroy$ = new Subject<void>();
  private store = inject(Store);

  loginForm: FormGroup;
  loginError: string | undefined;

  constructor(private formBuilder: FormBuilder, private actions$: Actions) {
    this.loginForm = this.formBuilder.nonNullable.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.actions$.pipe(ofType(AuthActions.loginActions.failure), takeUntil(this.destroy$))
      .subscribe(action => this.loginError = action.error);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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