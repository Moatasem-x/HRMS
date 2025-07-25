import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth-service';
import { ILoginData } from '../../Interfaces/ilogin-data';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;
  subs: Subscription[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
    
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && localStorage) {
      if (localStorage.getItem('token')) {
        this.router.navigate(['/employees']);
      }
    }
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    this.error = null;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const loginData: ILoginData = this.loginForm.value;
    this.subs.push(this.authService.login(loginData).subscribe({
      next: (resp) => {
        if (resp && resp.token) {
          console.log(resp);
          if (typeof window !== 'undefined' && localStorage) {
            localStorage.setItem('token', resp.token);
            localStorage.setItem('role', resp.role);
            localStorage.setItem('email', resp.email);
            localStorage.setItem('userName', resp.fullName);
            localStorage.setItem('userId', resp.employeeId);
          }
          this.authService.saveUserData();
          this.authService.userEmail.next(resp.email);
          this.authService.userRole.next(resp.role);
          this.authService.userName.next(resp.fullName);
          this.authService.userId.next(resp.employeeId);
          this.cdr.detectChanges();
          if (resp.role === "Employee") {
            this.router.navigate(['/empdash']);
          }
          else {
            this.router.navigate(['/hrdash']);
          }
        } 
        else {
          this.error = 'Invalid response from server.';
        }
      },
      error: (err) => {
        this.error = err?.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
