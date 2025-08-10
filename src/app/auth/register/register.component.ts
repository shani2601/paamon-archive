import { Component, inject, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import * as AuthActions from "../../state/auth/auth.actions";
import { Store } from "@ngrx/store";
import { User } from '../../models/user.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Actions, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

@Component({
    standalone: true,
    selector: 'app-register',
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule],
    styleUrls: ['./register.component.css'],
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  private store = inject(Store);
  registrationForm: FormGroup;
  registrationMessage: string | undefined;
  isDisabled = false;

  constructor(private formBuilder: FormBuilder, private actions$: Actions, private router: Router) {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    });

    this.actions$
      .pipe(ofType(AuthActions.registrationSuccess), takeUntil(this.onDestroy$))
      .subscribe(() => {
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      });

    this.actions$
      .pipe(ofType(AuthActions.registrationFailure), takeUntil(this.onDestroy$))
      .subscribe((action) => (this.registrationMessage = action.error));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  register() {
    if (!this.registrationForm.valid) {
      this.registrationMessage = "יש למלא את כל השדות";
    }
    else {
      if (this.registrationForm.value.password !== this.registrationForm.value.passwordConfirmation) {
        this.registrationMessage = "סיסמאות לא תואמות";
      }
      else {
        const { passwordConfirmation: passwordConfirmation, ...plainedUser } = this.registrationForm.value;
        const user: User = plainedUser;
        this.store.dispatch(AuthActions.registrationRequest({ user }));

        this.isDisabled = true;
        this.registrationMessage = "נרשמת בהצלחה למערכת!\n\nחוזרים למסך ההתחברות";
      }
    }
  }

  openLoginPage() {
    this.router.navigate(['/login']);
  }
}