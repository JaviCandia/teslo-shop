import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth/services/Auth.service';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin-dashboard-layout.html',
  styles: ``,
})
export class AdminDashboardLayout {
  authService = inject(AuthService);

  user = computed(() => this.authService.user());
}
