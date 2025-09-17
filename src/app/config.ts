import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient()
  ]
};

export const environment = {
    SOURCE_VERSION: "__SOURCE_VERSION__",
    SOURCE_COMMIT: "__SOURCE_COMMIT__",
}