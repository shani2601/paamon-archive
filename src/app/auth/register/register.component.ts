import { Component, inject, ViewChild, TemplateRef, DestroyRef } from "@angular/core";
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
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectRegistrationError, selectRegistrationDone } from "../../state/auth/auth.selectors";
import { first } from "rxjs/operators";

@Component({
    standalone: true,
    selector: 'app-register',
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule, MatProgressSpinnerModule, MatDialogModule, RouterLink],
    styleUrl: './register.component.css',
    templateUrl: './register.component.html'
})
export class RegisterComponent {
  @ViewChild('successDialog') successDialog!: TemplateRef<any>;

  private store = inject(Store);

  dialogRef: any;
  registrationForm: FormGroup;
  errorMessage: string | undefined;

  successMessage = "נרשמת בהצלחה למערכת!";

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private destroyRef: DestroyRef) {
    this.registrationForm = this.formBuilder.nonNullable.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)]],
      passwordConfirmation: ['', Validators.required],
    });

    this.store.select(selectRegistrationDone).pipe(first(isDone => isDone), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setSuccessDialog();
        setTimeout(() => this.dialogRef.close(), 1500);
      });

    this.store.select(selectRegistrationError).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(err => this.errorMessage = err ?? undefined);
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
    this.dialogRef = this.dialog.open(this.successDialog, {
      data: { message: this.successMessage },
      width: '320px',
      panelClass: 'custom-success-dialog'
    });
  }
}