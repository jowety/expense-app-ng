// src/app/core/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api'; // Import PrimeNG MessageService
// import { Router } from '@angular/router'; // Uncomment if you want to redirect

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private messageService: MessageService,
    // private router: Router // Inject Router if you plan to redirect on certain errors
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';

        if (error.error instanceof ErrorEvent) {
          // Client-side or network error occurred. Handle it accordingly.
          console.error('Client-side error:', error.error.message);
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${JSON.stringify(error.error)}`); // Stringify error.error for better logging

          if (error.status === 0) {
            errorMessage = 'Network error or backend is unreachable.';
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized: Please log in again.';
            // Example: Redirect to login page
            // this.router.navigate(['/login']);
          } else if (error.status === 403) {
            errorMessage = 'Forbidden: You do not have permission to access this resource.';
          } else if (error.status === 404) {
            errorMessage = 'Resource not found.';
          } else if (error.status >= 500) {
            errorMessage = `Server error: ${error.status} - ${error.statusText || 'Internal Server Error'}`;
            // Attempt to get a more specific message from the error body
            if (error.error && typeof error.error === 'object' && error.error.message) {
              errorMessage = error.error.message;
            } else if (error.error && typeof error.error === 'string' && error.error.length > 0) {
              errorMessage = error.error; // Sometimes backend sends a plain string error
            } else if (error.statusText) {
              errorMessage = `Server Error: ${error.statusText}`;
            }
          } else {
            // Generic HTTP error handling
            errorMessage = `Error ${error.status}: ${error.statusText || error.message}`;
            if (error.error && typeof error.error === 'object' && error.error.message) {
                errorMessage = error.error.message;
            } else if (error.error && typeof error.error === 'string' && error.error.length > 0) {
                errorMessage = error.error;
            }
          }
        }

        // Display the message using PrimeNG MessageService
        this.messageService.add({
          severity: 'error', // 'success', 'info', 'warn', 'error'
          summary: 'HTTP Error',
          detail: errorMessage,
          sticky: true
        });

        // Re-throw the error so that the component/service that initiated the request
        // can still handle it if specific logic is needed (e.g., displaying
        // an error message on a form field).
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}