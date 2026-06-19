import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '../../../core/services/incident.service';
import {
  Incident, IncidentType, IncidentStatus,
  INCIDENT_TYPE_LABELS, INCIDENT_STATUS_LABELS
} from '../../../core/models/incident.model';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Incidentes</h1>
          <p class="page-sub">{{ filtered().length }} registros encontrados</p>
        </div>
        <a routerLink="/incidents/new" class="btn-primary">+ Registrar incidente</a>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <select [(ngModel)]="filterStatus" class="filter-select">
          <option value="todos">Todos los estados</option>
          <option value="abierto">Abierto</option>
          <option value="en_curso">En curso</option>
          <option value="cerrado">Cerrado</option>
        </select>
        <select [(ngModel)]="filterType" class="filter-select">
          <option value="todos">Todos los tipos</option>
          @for (entry of typeOptions; track entry.value) {
            <option [value]="entry.value">{{ entry.label }}</option>
          }
        </select>
      </div>

      <!-- Tabla -->
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Fecha reporte</th>
              <th>Tipo</th>
              <th>Sitio</th>
              <th>Observación</th>
              <th>Estado</th>
              <th>Reportado por</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @if (filtered().length === 0) {
              <tr><td colspan="7" class="empty">Sin resultados para los filtros aplicados.</td></tr>
            }
            @for (inc of filtered(); track inc.id) {
              <tr>
                <td class="td-date">{{ inc.fechaReporte | date:'dd/MM/yyyy HH:mm' }}</td>
                <td><span class="tipo-tag">{{ typeLabel(inc.tipo) }}</span></td>
                <td>{{ inc.sitioAfectado ?? '—' }}</td>
                <td class="td-obs">{{ inc.observacion }}</td>
                <td>
                  <span class="badge" [class]="'badge-' + inc.estado">
                    {{ statusLabel(inc.estado) }}
                  </span>
                </td>
                <td>{{ inc.reportadoPor }}</td>
                <td>
                  <a [routerLink]="['/incidents', inc.id, 'edit']" class="btn-edit">Editar</a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1100px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .page-title { font-size: 24px; font-weight: 700; color: #0C2D4A; margin: 0 0 4px; }
    .page-sub { font-size: 14px; color: #64748B; margin: 0; }
    .btn-primary {
      background: #0C447C; color: #fff; padding: 10px 20px; border-radius: 8px;
      text-decoration: none; font-size: 14px; font-weight: 600;
    }
    .btn-primary:hover { background: #0a3868; }

    .filters { display: flex; gap: 12px; margin-bottom: 20px; }
    .filter-select {
      padding: 8px 12px; border: 1px solid #CBD5E1; border-radius: 8px;
      font-size: 14px; background: #fff; color: #374151; cursor: pointer;
    }
    .filter-select:focus { outline: none; border-color: #0C447C; }

    .card { background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); overflow: hidden; }
    .table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: #F8FAFC; }
    th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600;
         color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;
         border-bottom: 1px solid #E2E8F0; }
    td { padding: 14px 16px; border-bottom: 1px solid #F1F5F9; color: #374151; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #F8FAFC; }

    .td-date { white-space: nowrap; color: #64748B; }
    .td-obs { max-width: 280px; line-height: 1.4; }
    .tipo-tag {
      display: inline-block; background: #EFF6FF; color: #1D4ED8;
      padding: 3px 8px; border-radius: 4px; font-size: 12px; white-space: nowrap;
    }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; }
    .badge-abierto { background: #FEE2E2; color: #DC2626; }
    .badge-en_curso { background: #FEF3C7; color: #D97706; }
    .badge-cerrado { background: #D1FAE5; color: #059669; }
    .btn-edit {
      color: #0C447C; text-decoration: none; font-size: 13px; font-weight: 600;
      padding: 4px 10px; border: 1px solid #0C447C; border-radius: 6px;
    }
    .btn-edit:hover { background: #EFF6FF; }
    .empty { text-align: center; color: #94A3B8; padding: 32px !important; }
  `]
})
export class IncidentListComponent {
  private svc = inject(IncidentService);

  filterStatus = 'todos';
  filterType = 'todos';

  typeOptions = Object.entries(INCIDENT_TYPE_LABELS).map(([value, label]) => ({ value, label }));

  filtered = computed(() => {
    let list = this.svc.incidents();
    if (this.filterStatus !== 'todos') list = list.filter(i => i.estado === this.filterStatus);
    if (this.filterType !== 'todos') list = list.filter(i => i.tipo === this.filterType);
    return list;
  });

  typeLabel(tipo: string): string {
    return INCIDENT_TYPE_LABELS[tipo as IncidentType] ?? tipo;
  }
  statusLabel(estado: string): string {
    return INCIDENT_STATUS_LABELS[estado as IncidentStatus] ?? estado;
  }
}
