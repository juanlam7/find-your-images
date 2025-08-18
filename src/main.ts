import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

async function enableMocking() {
  if (!environment.useMockApi) {
    return;
  }

  const { worker } = await import('./mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
});
