import { Component, ViewChild, TemplateRef, DestroyRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import * as AuthActions from "../../../state/auth/auth.actions";
import { Store } from "@ngrx/store";
import { User } from '../../../models/user.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectRegistrationError, selectRegistrationDone } from "../../../state/auth/auth.selectors";
import { first } from "rxjs/operators";
import { AuthState } from "../../../state/auth/auth.reducer";
import { ROUTES } from "../../../routing/routing.consts";
import { AUTH_MESSAGES } from "../auth-messages.consts";
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-register',
    imports: [MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule, MatProgressSpinnerModule, MatDialogModule, RouterLink],
    styleUrl: './register.component.css',
    templateUrl: './register.component.html'
})
export class RegisterComponent {  
  @ViewChild('successDialog') successDialog!: TemplateRef<any>;

  ROUTES = ROUTES;
  hidePassword = true;
  hidePasswordConfirmation  = true;
  successMessage = AUTH_MESSAGES.REGISTER.SUCCESS_MESSAGE;
  dialogRef: any;
  registrationForm: FormGroup;
  errorMessage: string | undefined;

  constructor(private store: Store<AuthState>, private router: Router, private formBuilder: FormBuilder, private dialog: MatDialog, private destroyRef: DestroyRef) {
    this.registrationForm = this.formBuilder.nonNullable.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)]],
      passwordConfirmation: ['', Validators.required],
    });

    this.store.select(selectRegistrationDone).pipe(first(isDone => isDone), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {this.setSuccessDialog().afterClosed()
        .subscribe(() => {
          this.router.navigate([ROUTES.LOGIN.path]);
        })});

    this.store.select(selectRegistrationError).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(err => this.errorMessage = err ?? "");
  }

  ngOnDestroy() {
    this.store.dispatch(AuthActions.registrationActions.reset());
  }

  isFieldNotEmpty(fieldName: string): boolean {
    return (Boolean(this.registrationForm.get(fieldName)?.value));
  }

  areThereEmptyFields(): boolean {
    return (Object.keys(this.registrationForm.controls).some(name => !(this.isFieldNotEmpty(name))));
  }

  register() {
    if (this.areThereEmptyFields()) {
      this.errorMessage = AUTH_MESSAGES.EMPTY_FORM_FIELDS;
      return;
    }

    if (this.registrationForm.get('password')?.errors?.['pattern']) {
      this.errorMessage = AUTH_MESSAGES.REGISTER.ERROR_MESSAGES.INVALID_PASSWORD_REGEX;
      return;
    }

    if (this.registrationForm.value.password !== this.registrationForm.value.passwordConfirmation) {
      this.errorMessage = AUTH_MESSAGES.REGISTER.ERROR_MESSAGES.UNMATCHED_PASSWORDS;
      return;
    }

    const {passwordConfirmation: passwordConfirmation, ...plainedUser} = this.registrationForm.value;
    const user: User = plainedUser;
    this.store.dispatch(AuthActions.registrationActions.request({user}));
  }

  setSuccessDialog(): MatDialogRef<any> {
    this.dialogRef = this.dialog.open(this.successDialog, {
      width: '320px',
      panelClass: 'custom-success-dialog'
    });

    setTimeout(() => {this.dialogRef.close()}, 1500);

    return this.dialogRef;
  }
}