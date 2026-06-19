import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="brand-icon">⚓</span>
          <div>
            <div class="brand-name">CeCoPort</div>
            <div class="brand-sub">Registro de Incidentes</div>
          </div>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📊</span> Panel general
          </a>
          <a routerLink="/incidents" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📋</span> Incidentes
          </a>
          <a routerLink="/incidents/new" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">➕</span> Registrar incidente
          </a>
        </nav>
        <div class="sidebar-footer">EPSA · Puerto San Antonio</div>
      </aside>
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
      background: #F0F4F8;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .sidebar {
      width: 240px;
      min-height: 100vh;
      background: #0C2D4A;
      color: #fff;
      display: flex;
      flex-direction: column;
      padding: 0;
      position: fixed;
      top: 0; left: 0; bottom: 0;
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .brand-icon { font-size: 28px; }
    .brand-name { font-size: 16px; font-weight: 700; letter-spacing: 0.5px; }
    .brand-sub { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 2px; }
    .sidebar-nav {
      flex: 1;
      padding: 20px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      font-size: 14px;
      transition: all 0.15s;
    }
    .nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
    .nav-item.active { background: #0C447C; color: #fff; font-weight: 600; }
    .nav-icon { font-size: 16px; }
    .sidebar-footer {
      padding: 16px 20px;
      font-size: 11px;
      color: rgba(255,255,255,0.35);
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .main-content {
      margin-left: 240px;
      flex: 1;
      padding: 32px;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {}
