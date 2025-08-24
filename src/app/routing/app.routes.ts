import { Routes } from '@angular/router';
import { ROUTES } from './routing.consts';
import { LoginComponent } from '../components/auth/login/login.component';
import { RegisterComponent } from '../components/auth/register/register.component';
import { HomeComponent } from '../components/main/home/home.component';
import { authGuard } from '../state/auth/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo: ROUTES.HOME.pageName, pathMatch: 'full'},
    {path: ROUTES.LOGIN.pageName, component: LoginComponent},
    {path: ROUTES.REGISTER.pageName, component: RegisterComponent},
    {path: ROUTES.HOME.pageName, component: HomeComponent, canActivate: [authGuard]}
];
