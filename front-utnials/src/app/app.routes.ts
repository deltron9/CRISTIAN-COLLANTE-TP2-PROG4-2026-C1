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
                component: Login,
                canActivate: [RutasParaLogeadosGuard],
                title: 'Utnials | Login'
            },
            {
                path: 'register',
                component: Register,
                canActivate: [RutasParaLogeadosGuard],
                title: 'Utnials | Register'
            }
        ]
    },
    {
        path: 'pantalla-cargando',
        loadComponent: () => import('./pages/pantalla-cargando/pantalla-cargando').then((a) => a.PantallaCargando), title: 'Utnials | Verificando Sesión',
        canActivate: [RutasParaLogeadosGuard]
    },
    {
        path: 'mi-perfil',
        loadComponent: () => import('./pages/mi-perfil/mi-perfil').then((a) => a.MiPerfil), title: 'Utnials | mi perfil',
        canActivate: [RutasParaLogeadosGuard]
    },
    {
        path: 'publicaciones',
        loadComponent: () => import('./pages/publicaciones/publicaciones').then((a) => a.Publicaciones), title: 'Utnials | publicaciones',
        canActivate: [RutasParaLogeadosGuard]
    },
    {
        path: 'error-page',
        component: ErrorPage, title: 'Utnials | Error'
    },
    {
        path: '**',
        redirectTo: 'error-page'
    }
];