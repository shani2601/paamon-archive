import { Component, inject, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as AuthActions from "../../state/auth/auth.actions";
import { User } from "../../models/user.model";
import { Actions, ofType } from "@ngrx/effects";
import { Subject, takeUntil } from "rxjs";

@Component({
    standalone: true,
    selector: 'app-login',
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, ReactiveFormsModule],
    styleUrls: ['./login.component.css'],
    template: `<main lang="he" dir="rtl">
        <h1 class="title">כניסה למערכת</h1>
        <form [formGroup]="loginForm">
            <mat-form-field>
              <input formControlName="username" matInput placeholder="שם משתמש">
            </mat-form-field>
            
            <mat-form-field>
              <input formControlName="password" matInput placeholder="סיסמה">
            </mat-form-field>

            <button mat-stroked-button class="login-btn" (click)="login()">התחבר</button>
            <label class="login-error">{{ loginError }}</label>
        </form>

        <label class="no-user">אין לך משתמש?</label>
        <button mat-stroked-button class="register-btn" (click)="openRegisterPage()">הרשמה</button>
    </main>`
})
export class LoginComponent implements OnDestroy{
  private destroy$ = new Subject<void>();

  private store = inject(Store);
  loginForm: FormGroup;
  loginError: string | undefined;

  constructor(private router: Router, private formBuilder: FormBuilder, private actions$: Actions) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.actions$.pipe(ofType(AuthActions.loginSuccess), takeUntil(this.destroy$))
      .subscribe(() => this.openAppPage());

    this.actions$.pipe(ofType(AuthActions.loginFailure), takeUntil(this.destroy$))
      .subscribe(action => this.loginError = action.error);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login() {
    if (this.loginForm.valid) {
      const user: User = this.loginForm.value;
      this.store.dispatch(AuthActions.loginRequest({user}));
    }
    else {
      this.loginError = "יש למלא את כל השדות";
    }
  }

  openAppPage() {
    this.router.navigate(['/home']);
  }

  openRegisterPage() {
    this.router.navigate(['/register']);
  }
}