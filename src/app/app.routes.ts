import { Routes } from '@angular/router';
import { GuestGuard } from '@auth/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      GuestGuard
    ]
  },
  {
    path: '', // los path vacíos siempre van al penúltimo, antes del wildcard **
    loadChildren: () => import('./store-front/store-front.routes'),
  },
];
