import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private title: Title,
    private meta: Meta
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.title.setTitle('Login | Demo App');
    this.meta.updateTag({ name: 'description', content: 'Log in to access your dashboard in the Demo App.' });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';
      
      // Prepare payload for backend
      const loginPayload = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        timestamp: new Date().toISOString(),
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language
        }
      };

      console.log('Login payload being sent to backend:', loginPayload);

      this.http.post('https://jsonplaceholder.typicode.com/posts', loginPayload)
        .pipe(
          catchError(error => {
            console.error('Failed to send payload:', error);
            return of(null);
          })
        )
        .subscribe(response => {
          if (response) {
            console.log('Payload sent. Demo response:', response);
          }
        });

      // DEMO CREDENTIALS CHECK
      const validCredentials = [
        { email: 'counterpin7@gmail.com', password: 'admin123' },
        { email: 'user@test.com', password: 'password' },
        { email: 'demo@demo.com', password: 'demo123' }
      ];

      const isValidUser = validCredentials.some(
        cred => cred.email === loginPayload.email && cred.password === loginPayload.password
      );

      // Simulate API delay
      setTimeout(() => {
        this.isLoading = false;
        
        if (isValidUser) {
          console.log('Login successful with demo credentials');
          
          // Store demo token
          const token = 'demo-token-' + Date.now();
          sessionStorage.setItem('authToken', token);
          
          // Navigate to returnUrl if present; else to dashboard
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
          this.router.navigateByUrl(returnUrl);
          
        } else {
          this.loginError = 'Invalid email or password. Try: counterpin7@gmail.com / admin123';
        }
      }, 1000);
      
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  onSignUp() {
    console.log('Navigate to sign up');
    // Handle navigation to sign up page
  }

  onForgotPassword() {
    console.log('Navigate to forgot password');
    // Handle forgot password logic
  }
}
