import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environment';
import { User } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public isAdmin$ = new BehaviorSubject<boolean>(false);
  public isUploader$ = new BehaviorSubject<boolean>(false);
  private baseUrl: string = environment.BASE_URL;

  constructor(
    private http: HttpClient,
    //private cookieService: CookieService,
    private router: Router,
  ) {
    if (localStorage.getItem('email')) this.isLoggedIn$.next(true);
    if (localStorage.getItem('role') === 'superadmin') {
      this.isAdmin$.next(true);
      this.isUploader$.next(true);
    }
    if (localStorage.getItem('role') === 'uploader')
      this.isUploader$.next(true);
  }

  public async login(email: string, password: string): Promise<User> {
    const formData = this.getFormData(email, password);
    try {
      const result$ = this.http.post<User>(`${this.baseUrl}/login`, formData);
      const userData = await firstValueFrom(result$);
      this.storeDataLocally(userData);
      this.setSubjectValues(userData);
      this.router.navigate(['/home']);
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

  private storeDataLocally(userData: User) {
    localStorage.setItem('role', userData.role);
    localStorage.setItem('email', userData.email);
  }

  private setSubjectValues(userData: User) {
    this.isLoggedIn$.next(true);
    this.isAdmin$.next(false);
    this.isUploader$.next(false);
    if (userData.role === 'superadmin') {
      this.isAdmin$.next(true);
      this.isUploader$.next(true);
    }
    if (userData.role === 'uploader') this.isUploader$.next(true);
  }

  public logout(): void {
    this.logoutonClient();
    this.logoutOnServer();
    this.router.navigate(['/']);
  }

  public logoutonClient(): void {
    this.isLoggedIn$.next(false);
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    //this.cookieService.delete("PHPSESSID");
    //this.cookieService.delete('PHPSESSID', '/', 'luciendelmar.com');
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

  public getUserEmail(): string {
    return localStorage.getItem('email')!;
  }
}
