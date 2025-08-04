import { Component, inject } from "@angular/core";
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

@Component({
    standalone: true,
    selector: 'app-register',
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule],
    styleUrls: ['./register.component.css'],
    template: `<main lang="he" dir="rtl">
        <h2>הרשמה למערכת</h2><br>
        <form [formGroup]="registrationForm">
            <mat-form-field>
                <input formControlName="firstName" matInput placeholder="שם פרטי">
            </mat-form-field><br>
            <mat-form-field>
                <input formControlName="lastName" matInput placeholder="שם משפחה">
            </mat-form-field><br>
            <mat-form-field>
                <input formControlName="username" matInput placeholder="שם משתמש">
            </mat-form-field><br>
            <mat-form-field>
                <input formControlName="password" type="password" matInput placeholder="סיסמה">
            </mat-form-field><br>
            <mat-form-field>
                <input formControlName="passwordConfirming" type="password" matInput placeholder="אישור סיסמה">
            </mat-form-field><br>
            <button mat-stroked-button type="button" (click)="register()">הירשם</button><br>
            <div class="messages">
                <label class="confirm-message" *ngIf="hasRegistrationSucceeded === true">נרשמת בהצלחה למערכת!<br><br>חוזרים למסך ההתחברות</label>
                <label class="existed-username-message" *ngIf="hasRegistrationSucceeded === false">שם משתמש כבר קיים במערכת</label>
                <label class="missing-fields-message" *ngIf="isFormValid === false">יש למלא את כל השדות</label>
                <label class="unmatched-passwords-message" *ngIf="doPasswordsMatch === false">סיסמאות לא תואמות</label>
            </div>
        </form>

        <div class="already-have-user">
            <label class="have-user-title">יש לך משתמש?</label>
            <button mat-stroked-button class="login-btn" type="button" (click)="openLoginPage()">התחבר</button>
        </div>
    </main>`
})
export class RegisterComponent {
    private store = inject(Store);

    hasRegistrationSucceeded: boolean | undefined;
    isFormValid: boolean | undefined;
    doPasswordsMatch: boolean | undefined;

    registrationForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private actions$: Actions, private router: Router) {
        this.registrationForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
            passwordConfirming: ['', Validators.required]
        });

        this.actions$.pipe(ofType(AuthActions.registrationSuccess, AuthActions.registrationFailure)).subscribe((action) => {
            if (action.type === AuthActions.registrationSuccess.type) {
                this.hasRegistrationSucceeded = true;
            }
            else if (action.type === AuthActions.registrationFailure.type) {
                this.hasRegistrationSucceeded = false;
            }
        });
    }

    register() {
        if (this.registrationForm.valid) {
            if (this.registrationForm.value.password === this.registrationForm.value.passwordConfirming) {
                this.isFormValid = true;
                this.doPasswordsMatch = true;

                const user: User = this.registrationForm.value;
                this.store.dispatch(AuthActions.registrationRequest({user}));

                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 3000);
            }
            else {
                this.doPasswordsMatch = false;
            }
        }
        else {
            this.isFormValid = false;
        }
    }

    openLoginPage() {
        this.router.navigate(['/login']);
    }
}