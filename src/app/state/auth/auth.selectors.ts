import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.reducer";

const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(selectAuth, store => store.user);
export const selectIsLoggedIn = createSelector(selectUser, user => !!user);

export const selectLoginLoading = createSelector(selectAuth, store => store.login.loading);
export const selectLoginError = createSelector(selectAuth, store => store.login.error);

export const selectRegistrationLoading = createSelector(selectAuth, store => store.register.loading);
export const selectRegistrationError = createSelector(selectAuth, store => store.register.error);
export const selectRegistrationDone = createSelector(selectAuth, store => store.register.done);