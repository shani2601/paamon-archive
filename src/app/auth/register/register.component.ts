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
import { Subject, takeUntil } from "rxjs";
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-register',
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule, MatProgressSpinnerModule, MatDialogModule, RouterLink],
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
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private actions$: Actions, private dialog: MatDialog) {
    this.registrationForm = this.formBuilder.nonNullable.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)]],
      passwordConfirmation: ['', Validators.required],
    });

    this.actions$
      .pipe(ofType(AuthActions.registrationActions.success), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.setSuccessDialog();
        setTimeout(() => this.dialogRef.close(), 1500);
      });

    this.actions$
      .pipe(ofType(AuthActions.registrationActions.failure), takeUntil(this.onDestroy$))
      .subscribe((action) => (this.errorMessage = action.error));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  register() {
    if (this.registrationForm.invalid) {
      if (this.registrationForm.get('password')?.errors?.['pattern']) {
        this.errorMessage = "הסיסמה חייבת להכיל שמונה תווים לפחות, ולכלול אותיות ומספרים";
        return;
      }

      this.errorMessage = "יש למלא את כל השדות";
      return;
    }

    if (this.registrationForm.value.password !== this.registrationForm.value.passwordConfirmation) {
      this.errorMessage = "סיסמאות לא תואמות";
      return;
    }

    const { passwordConfirmation: passwordConfirmation, ...plainedUser } = this.registrationForm.value;
    const user: User = plainedUser;
    this.store.dispatch(AuthActions.registrationActions.request({ user }));
  }

  setSuccessDialog() {
    this.errorMessage = undefined;

    this.isLoading = true;
    this.successMessage = "נרשמת בהצלחה למערכת!";

    this.dialogRef = this.dialog.open(this.successDialog, {
      data: { message: this.successMessage },
      width: '320px',
      panelClass: 'custom-success-dialog'
    });
  }
}