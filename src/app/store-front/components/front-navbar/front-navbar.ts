import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '@auth/services/Auth.service';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink],
  templateUrl: './front-navbar.html',
  styles: ``,
})
export class FrontNavbar {
  authService = inject(AuthService);

}
