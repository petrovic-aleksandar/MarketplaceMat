import { Routes } from '@angular/router';
import { Homepage } from './components/homepage/homepage';
import { Admin } from './components/admin/admin';
import { authGuard } from './guard/auth-guard';
import { adminGuard } from './guard/admin-guard';
import { UserItems } from './components/user-items/user-items';
import { UserSettings } from './components/user-settings/user-settings';
import { ItemTypes } from './components/item-types/item-types';
import { ItemsByType } from './components/items-by-type/items-by-type';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

export const routes: Routes = [
    {
        path: 'homepage',
        component: Homepage
    },
    {
        path: 'admin',
        component: Admin,
        canActivate: [authGuard,adminGuard]
    },
    {
        path: 'user-items',
        component: UserItems,
        canActivate: [authGuard]
    },
    {
        path: 'user-settings',
        component: UserSettings,
        canActivate: [authGuard]
    },
    {
        path: 'item-types',
        component: ItemTypes
    },
    {
        path: 'items-by-type/:id',
        component: ItemsByType
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    }];
