import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { ErrorInterceptor } from './error-interceptor';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    MessageService, // Provide PrimeNG MessageService
    provideHttpClient(
      withInterceptorsFromDi() // This enables class-based interceptors
    ),
    // Register your ErrorInterceptor using the HTTP_INTERCEPTORS token
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true // Essential: allows multiple interceptors to be registered
    },
    provideClientHydration(withEventReplay()), 
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura
        }
    })  
  ]
};
