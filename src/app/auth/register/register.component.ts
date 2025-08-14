import { Component, inject, OnDestroy, ViewChild, TemplateRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
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
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule, MatProgressSpinnerModule, MatDialogModule],
    styleUrls: ['./register.component.css'],
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnDestroy {
  @ViewChild('successDialog') successDialog!: TemplateRef<any>;

  private onDestroy$ = new Subject<void>();
  private store = inject(Store);

  dialogRef: any;
  registrationForm: FormGroup;
  errorMessage: string | undefined;
  successMessage: string | undefined;
  isDisabled = false;
  isLoading = false;

  passwordRegex = /^(?=.*[a-z])(?=.\d).{8,}$/;

  constructor(private formBuilder: FormBuilder, private actions$: Actions, private router: Router, private dialog: MatDialog) {
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
        this.setSuccessDialog();

        setTimeout(() => {
          this.dialogRef.close();
          this.router.navigate(['/login']);
        }, 1500);
      });

    this.actions$
      .pipe(ofType(AuthActions.registrationFailure), takeUntil(this.onDestroy$))
      .subscribe((action) => (this.errorMessage = action.error));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  isPasswordRegexValid() {
    return (this.passwordRegex.test(this.registrationForm.value.password));
  }

  register() {
    if (!this.registrationForm.valid) {
      this.errorMessage = "יש למלא את כל השדות";
    }
    else if (!(this.isPasswordRegexValid())) {
      this.errorMessage = "הסיסמה חייבת להכיל שמונה תווים לפחות, ולכלול אותיות ומספרים";
    }
    else {
      if (this.registrationForm.value.password !== this.registrationForm.value.passwordConfirmation) {
        this.errorMessage = "סיסמאות לא תואמות";
      }
      else {
        const { passwordConfirmation: passwordConfirmation, ...plainedUser } = this.registrationForm.value;
        const user: User = plainedUser;
        this.store.dispatch(AuthActions.registrationRequest({ user }));
      }
    }
  }

  openLoginPage() {
    this.router.navigate(['/login']);
  }

  setSuccessDialog() {
    this.errorMessage = undefined;

    this.isLoading = true;
    this.isDisabled = true;
    this.successMessage = "נרשמת בהצלחה למערכת!";

    this.dialogRef = this.dialog.open(this.successDialog, {
      data: { message: this.successMessage },
      width: '320px',
      panelClass: 'custom-success-dialog'
    });
  }
}