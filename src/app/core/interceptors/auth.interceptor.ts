import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { environment } from '@envs/environment';

const API_KEY = environment.accessKey;

export function AuthInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const newReq = req.clone({
    headers: req.headers
      .append('Accept-Version', 'v1')
      .append('Authorization', `Client-ID ${API_KEY}`),
  });
  return next(newReq);
}
