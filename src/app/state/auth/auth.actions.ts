import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';


// Login Actions
export const loginRequest = createAction(
    '[Auth] Login Request',
    props<{user: User}>()
);

export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<{user: User}>()
);

export const loginFailure = createAction(
    '[Auth] Login Failure',
    props<{error: string}>()
);


// Registration Actions
export const registrationRequest = createAction(
    '[Auth] Registration Request',
    props<{user: User}>()
);

export const registrationSuccess = createAction(
    '[Auth] Registration Success',
    props<{user: User}>()
);

export const registrationFailure = createAction(
    '[Auth] Registration Failure',
    props<{error: string}>()
);