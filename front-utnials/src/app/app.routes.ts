import { Routes } from '@angular/router';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
import { ErrorPage } from './pages/error-page/error-page';
import { RutasParaLogeadosGuard } from './auth/guards/rutas-para-logeados-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                component: Login
            },
            {
                path: 'register',
                component: Register
            }
        ]
    },
    {
        path: 'mi-perfil',
        loadComponent: () => import('./pages/mi-perfil/mi-perfil').then((a) => a.MiPerfil),
        canActivate: [RutasParaLogeadosGuard]
    },
    {
        path: 'publicaciones',
        loadComponent: () => import('./pages/publicaciones/publicaciones').then((a) => a.Publicaciones),
        canActivate: [RutasParaLogeadosGuard]
    },
    {
        path: 'error-page',
        component: ErrorPage
    },
    {
        path: '**',
        redirectTo: 'error-page'
    }
];