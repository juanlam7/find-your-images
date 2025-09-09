import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'images', pathMatch: 'full' },
  {
    path: 'images',
    loadChildren: () => import('./features/images/image.routes'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
