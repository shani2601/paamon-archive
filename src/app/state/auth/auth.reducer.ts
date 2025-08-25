import { User } from "../../models/user.model";
import { createReducer, on } from "@ngrx/store";
import * as AuthActions from '../auth/auth.actions';

export interface AuthState {
    user: User | null;
    login: {loading: boolean;  error: string | null};
    register: {loading: boolean; error: string | null; done: boolean};
}

const initialAuthState: AuthState = {
    user: null,
    login: {loading: false, error: null},
    register: {loading: false, error: null, done: false},
};

export const authReducer = createReducer(
    initialAuthState,

    // Login  
    on(AuthActions.loginActions.request, state => ({
        ...state, login: {loading: true, error: null}
    })),
    on(AuthActions.loginActions.success, (state, {user}) => ({
        ...state, user, login: {loading: false, error: null}
    })),
    on(AuthActions.loginActions.failure, (state, {error}) => ({
        ...state, login: {loading: false, error}
    })),
    on(AuthActions.loginActions.reset, state => ({
        ...state, login: {loading: false, error: null}
    })),

    // Registration
    on(AuthActions.registrationActions.request, state => ({
        ...state, register: {loading: true, error: null, done: false}
    })),
    on(AuthActions.registrationActions.success, state => ({
        ...state, register: {loading: false, error: null, done: true}
    })),
    on(AuthActions.registrationActions.failure, (state, {error}) => ({
        ...state, register: {loading: false, error, done: false}
    })),
    on(AuthActions.registrationActions.reset, state => ({
        ...state, register: {loading: false, error: null, done: false}
    }))
);