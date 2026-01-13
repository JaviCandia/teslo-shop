import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Arquitectura
  // FILTRO: Si la URL no es de mi API, ¡Déjala pasar limpia!
  // (Esto evita mandarle tu token a Google, Cloudinary, etc.)
  if (!req.url.includes('/api')) {
    return next(req);
  }

  //   const token = inject(AuthService).token(); // aquí hay una dependencia circular
  const token = localStorage.getItem('token'); // con esto la solucionamos

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  return next(newReq);
}
