import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((c) => c.Home),
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./pages/detail/detail').then((c) => c.Detail),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites/favorites').then((c) => c.Favorites),
  },
  { path: '**', redirectTo: 'home' },
];
