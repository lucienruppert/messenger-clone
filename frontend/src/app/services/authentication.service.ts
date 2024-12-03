import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { environment } from '../environment';
import { User } from '../types';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private emailSubject = new BehaviorSubject<string>('');
  public email$ = this.emailSubject.asObservable();
  private baseUrl: string = environment.BASE_URL;

  constructor(
    private http: HttpClient,
    private router: Router,
    private webSocketService: WebSocketService,
  ) {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedIn$.next(isLoggedIn);
  }

  public async login(email: string, password: string): Promise<User> {
    const formData = this.getFormData(email, password);
    try {
      const result$ = this.http.post<User>(`${this.baseUrl}/login`, formData);
      const userData = await firstValueFrom(result$);
      this.setSessionState(true, email);
      this.router.navigate(['/dashboard']);
      this.webSocketService.connect(); // Connect to WebSocket after successful login
      this.sendEmailThroughWebSocket(email);
      return userData;
    } catch (error: unknown) {
      const typedError = error as HttpErrorResponse;
      if (typedError.error['errors'])
        throw typedError.error['errors'].join(' ');
      return typedError.error['errors'];
    }
  }

  private getFormData(email: string, password: string): FormData {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    return formData;
  }

  private setSessionState(isLoggedIn: boolean, email: string): void {
    sessionStorage.setItem('isLoggedIn', isLoggedIn.toString());
    this.emailSubject.next(email);
    this.isLoggedIn$.next(isLoggedIn);
  }

  public logout(): void {
    this.logoutonClient();
    this.logoutOnServer();
    this.webSocketService.disconnect();
    this.router.navigate(['/']);
  }

  public logoutonClient(): void {
    this.setSessionState(false, '');
  }

  public async logoutOnServer(): Promise<void> {
    try {
      const result$ = this.http.post(`${this.baseUrl}/logout`, {});
      const response = await firstValueFrom(result$);
      console.log(response);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  private sendEmailThroughWebSocket(email: string): void {
    this.webSocketService.sendMessage({ type: 'login', email: email });
  }
}
