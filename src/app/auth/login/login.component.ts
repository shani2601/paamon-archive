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
    templateUrl: './login.component.html'
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