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

export const authReducer = createReducer(
    initialAuthState,
    
    // Login
    on(AuthActions.loginRequest, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(AuthActions.loginSuccess, (state, {user}) => ({
        ...state,
        user,
        loading: false,
        error: null
    })),
    on(AuthActions.loginFailure, (state, {error}) => ({
        ...state,
        loading: false,
        error: error
    })),

    // Registration
    on(AuthActions.registrationRequest, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(AuthActions.registrationSuccess, (state, {user}) => ({
        ...state,
        user,
        loading: false,
        error: null
    })),
    on(AuthActions.registrationFailure, (state, {error}) => ({
        ...state,
        loading: false,
        error: error
    }))
);