import { Routes } from '@angular/router';
import { GuestGuard } from '@auth/guards/guest.guard';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [GuestGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
    canMatch: [IsAdminGuard]
  },
  {
    path: '', // los path vacíos siempre van al penúltimo, antes del wildcard **
    loadChildren: () => import('./store-front/store-front.routes'),
  },
];
