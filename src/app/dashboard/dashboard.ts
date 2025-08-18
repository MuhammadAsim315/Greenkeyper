import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <div class="logo">
            <h1>Logo</h1>
          </div>
          <div class="header-actions">
            <span class="welcome-text">Welcome back!</span>
            <button class="logout-btn" (click)="logout()">Logout</button>
          </div>
        </div>
      </header>

      <main class="dashboard-main">
        <div class="welcome-section">
          <h2>Dashboard</h2>
          <p>Login successful! You are now in the dashboard.</p>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      font-family: 'Arial', sans-serif;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #2c7a7b 0%, #319795 50%, #38b2ac 100%);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .welcome-text {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .logout-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .logout-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .dashboard-main {
      max-width: 800px;
      margin: 0 auto;
      padding: 4rem 2rem;
      text-align: center;
    }

    .welcome-section h2 {
      color: #2c7a7b;
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: bold;
    }

    .welcome-section p {
      color: #6b7280;
      font-size: 1.1rem;
    }
  `]
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private title: Title) {}

  ngOnInit() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.log('No auth token found, redirecting to login');
      this.router.navigate(['/login']);
    } else {
      console.log('User authenticated, showing dashboard');
    }

    this.title.setTitle('Dashboard | Demo App');
  }

  logout() {
    sessionStorage.removeItem('authToken');
    this.router.navigate(['/login']);
    console.log('User logged out');
  }
}
