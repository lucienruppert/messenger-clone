import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, MatProgressSpinnerModule, NgIf],
})
export class LoginComponent {
  public email: string = '';
  public password: string = '';
  public errorMessage: string = '';
  public showSpinner: boolean = false;

  constructor(private authentication: AuthenticationService) {}

  public async submitForm(): Promise<void> {
    this.showSpinner = true;
    try {
      await this.authentication.login(this.email, this.password);
    } catch (error: unknown) {
      const typedError = error as string;
      this.errorMessage = typedError;
    }
    this.showSpinner = false;
  }
}
