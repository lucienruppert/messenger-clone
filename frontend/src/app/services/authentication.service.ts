import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { User } from '../types';
import { WebSocketService } from './websocket.service';
import { environment } from '../environments/environment';

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
    const storedEmail = sessionStorage.getItem('userEmail') || '';
    this.isLoggedIn$.next(isLoggedIn);
    this.emailSubject.next(storedEmail);
  }

  public async login(email: string, password: string): Promise<User> {
    const formData = this.getFormData(email, password);
    try {
      const result$ = this.http.post<User>(`${this.baseUrl}/login`, formData);
      const userData = await firstValueFrom(result$);
      this.setSessionState(true, email);
      const name$ = this.http.post<string>(`${this.baseUrl}/username`, { email });
      const name = await firstValueFrom(name$);
      sessionStorage.setItem('userName', name);
      this.router.navigate(['/dashboard']);
      this.webSocketService.connect();
      this.sendUserDataThroughWebSocket(email, name);
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
    sessionStorage.setItem('userEmail', email);
    this.emailSubject.next(email);
    this.isLoggedIn$.next(isLoggedIn);
  }

  public logout(): void {
    console.log('Logging out and disconnecting WebSocket...');
    this.logoutonClient();
    this.logoutOnServer();
    this.webSocketService.disconnect();
    this.router.navigate(['/']);
  }

  public logoutonClient(): void {
    this.setSessionState(false, '');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userName');
  }

  public async logoutOnServer(): Promise<void> {
    try {
      const result$ = this.http.post(`${this.baseUrl}/logout`, {});
      const response = await firstValueFrom(result$);
      console.log('Logout response:', response);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  private sendUserDataThroughWebSocket(email: string, name: string): void {
    this.webSocketService.sendMessage({
      type: 'login',
      senderEmail: email,
      name,
    });
  }
}
