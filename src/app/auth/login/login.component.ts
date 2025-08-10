import { Component, inject } from "@angular/core";
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

            <button mat-stroked-button class="login-btn" (click)="login(); openAppPage()">התחבר</button>
            <label class="login-error">{{ loginError }}</label>
        </form>

        <label class="no-user">אין לך משתמש?</label>
        <button mat-stroked-button class="register-btn" (click)="openRegisterPage()">הרשמה</button>
    </main>`
})
export class LoginComponent {
  private store = inject(Store);
  loginForm: FormGroup;
  hasLoginSucceded: boolean | undefined;
  loginError: string | undefined;

  constructor(private router: Router, private formBuilder: FormBuilder, private actions$: Actions) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.actions$.pipe(ofType(AuthActions.loginSuccess, AuthActions.loginFailure)).subscribe((action) => {
        if (action.type === AuthActions.loginSuccess.type) {
            this.hasLoginSucceded = true;
                    }
        else if (action.type === AuthActions.loginFailure.type) {
            this.hasLoginSucceded = false;
            this.loginError = action.error;
        }
    });
  }

  login() {
    if (this.loginForm.valid) {
      const user: User = this.loginForm.value;
      this.store.dispatch(AuthActions.loginRequest({user}));
    }
  }

  openAppPage() {
    this.router.navigate(['/home']);
  }

  openRegisterPage() {
    this.router.navigate(['/register']);
  }
}