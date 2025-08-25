import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

function createAuthActions(actionKind: string) {
  return {
    request: createAction(
      `[Auth] ${actionKind} Request`,
      props<{ user: User }>()
    ),
    success: createAction(
      `[Auth] ${actionKind} Success`,
      props<{ user: User }>()
    ),
    failure: createAction(
      `[Auth] ${actionKind} Failure`,
      props<{ error: string }>()
    ),
  };
}

export const resetRegistration = createAction('[Auth] Reset Registration');

export const loginActions = createAuthActions('Login');
export const registrationActions = createAuthActions('Registration');