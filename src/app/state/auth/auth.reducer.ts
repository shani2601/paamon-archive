import { User } from "../../models/user.model";
import { createReducer, on } from "@ngrx/store";
import * as AuthActions from '../auth/auth.actions';

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

export interface AppState {
    auth: AuthState;
}

export const initialAuthState: AuthState = {
    user: null,
    loading: false,
    error: null
};

const setRequest = (state: AuthState): AuthState => ({
    ...state,
    loading: true,
    error: null
});

const setSuccess = (state: AuthState, user: User): AuthState => ({
    ...state,
    user,
    loading: false,
    error: null
});

const setFailure = (state: AuthState, error: string): AuthState => ({
    ...state,
    loading: false,
    error
});

export const authReducer = createReducer(
    initialAuthState,
    
    on(AuthActions.loginActions.request, AuthActions.registrationActions.request, state => setRequest(state)),
    on(AuthActions.loginActions.success, AuthActions.registrationActions.success, (state, {user}) => setSuccess(state, user)),
    on(AuthActions.loginActions.failure, AuthActions.registrationActions.failure, (state, {error}) => setFailure(state, error))
);