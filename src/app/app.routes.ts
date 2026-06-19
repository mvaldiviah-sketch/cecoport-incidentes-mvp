import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'incidents',
    loadComponent: () =>
      import('./features/incidents/incident-list/incident-list.component').then(m => m.IncidentListComponent),
  },
  {
    path: 'incidents/new',
    loadComponent: () =>
      import('./features/incidents/incident-form/incident-form.component').then(m => m.IncidentFormComponent),
  },
  {
    path: 'incidents/:id/edit',
    loadComponent: () =>
      import('./features/incidents/incident-form/incident-form.component').then(m => m.IncidentFormComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
