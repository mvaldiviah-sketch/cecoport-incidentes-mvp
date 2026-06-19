import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IncidentService } from '../../core/services/incident.service';
import { INCIDENT_TYPE_LABELS } from '../../core/models/incident.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Panel general</h1>
          <p class="page-sub">Resumen operativo de incidentes · Puerto San Antonio</p>
        </div>
        <a routerLink="/incidents/new" class="btn-primary">+ Registrar incidente</a>
      </div>

      <!-- KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-value">{{ stats().total }}</div>
          <div class="kpi-label">Total incidentes</div>
        </div>
        <div class="kpi-card kpi-danger">
          <div class="kpi-value">{{ stats().abiertos }}</div>
          <div class="kpi-label">Abiertos</div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-value">{{ stats().enCurso }}</div>
          <div class="kpi-label">En curso</div>
        </div>
        <div class="kpi-card kpi-ok">
          <div class="kpi-value">{{ stats().cerrados }}</div>
          <div class="kpi-label">Cerrados</div>
        </div>
      </div>

      <div class="two-col">
        <!-- Incidentes por tipo -->
        <div class="card">
          <div class="card-header">Incidentes por tipo</div>
          <div class="type-list">
            @for (entry of typeEntries(); track entry.tipo) {
              <div class="type-row">
                <span class="type-label">{{ entry.label }}</span>
                <div class="type-bar-wrap">
                  <div class="type-bar" [style.width.%]="entry.pct"></div>
                </div>
                <span class="type-count">{{ entry.count }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Últimos incidentes abiertos -->
        <div class="card">
          <div class="card-header">Incidentes activos</div>
          @if (activeIncidents().length === 0) {
            <p class="empty">Sin incidentes activos actualmente.</p>
          } @else {
            <div class="active-list">
              @for (inc of activeIncidents(); track inc.id) {
                <div class="active-row">
                  <div class="active-top">
                    <span class="badge" [class]="'badge-' + inc.estado">
                      {{ statusLabel(inc.estado) }}
                    </span>
                    <span class="active-site">{{ inc.sitioAfectado ?? 'Sin sitio específico' }}</span>
                  </div>
                  <div class="active-tipo">{{ typeLabel(inc.tipo) }}</div>
                  <div class="active-obs">{{ inc.observacion }}</div>
                  <div class="active-date">Desde {{ inc.fechaInicio | date:'dd/MM/yyyy HH:mm' }}</div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1100px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
    .page-title { font-size: 24px; font-weight: 700; color: #0C2D4A; margin: 0 0 4px; }
    .page-sub { font-size: 14px; color: #64748B; margin: 0; }
    .btn-primary {
      background: #0C447C; color: #fff; padding: 10px 20px; border-radius: 8px;
      text-decoration: none; font-size: 14px; font-weight: 600; white-space: nowrap;
    }
    .btn-primary:hover { background: #0a3868; }

    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .kpi-card {
      background: #fff; border-radius: 12px; padding: 20px 24px;
      border-left: 4px solid #0C447C; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .kpi-card.kpi-danger { border-left-color: #DC2626; }
    .kpi-card.kpi-warning { border-left-color: #D97706; }
    .kpi-card.kpi-ok { border-left-color: #059669; }
    .kpi-value { font-size: 36px; font-weight: 800; color: #0C2D4A; line-height: 1; }
    .kpi-label { font-size: 13px; color: #64748B; margin-top: 6px; }

    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
    .card-header { font-size: 15px; font-weight: 700; color: #0C2D4A; margin-bottom: 20px; }

    .type-list { display: flex; flex-direction: column; gap: 12px; }
    .type-row { display: flex; align-items: center; gap: 10px; }
    .type-label { font-size: 13px; color: #374151; width: 190px; flex-shrink: 0; }
    .type-bar-wrap { flex: 1; background: #F1F5F9; border-radius: 4px; height: 8px; overflow: hidden; }
    .type-bar { height: 100%; background: #0C447C; border-radius: 4px; transition: width 0.3s; min-width: 4px; }
    .type-count { font-size: 13px; font-weight: 700; color: #0C2D4A; width: 24px; text-align: right; }

    .active-list { display: flex; flex-direction: column; gap: 14px; }
    .active-row { border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; }
    .active-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .active-site { font-size: 12px; color: #64748B; }
    .active-tipo { font-size: 13px; font-weight: 600; color: #0C2D4A; margin-bottom: 4px; }
    .active-obs { font-size: 13px; color: #374151; margin-bottom: 6px; line-height: 1.4; }
    .active-date { font-size: 11px; color: #94A3B8; }
    .empty { font-size: 14px; color: #94A3B8; padding: 20px 0; text-align: center; }

    .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-abierto { background: #FEE2E2; color: #DC2626; }
    .badge-en_curso { background: #FEF3C7; color: #D97706; }
    .badge-cerrado { background: #D1FAE5; color: #059669; }
  `]
})
export class DashboardComponent {
  private svc = inject(IncidentService);
  stats = this.svc.stats;

  activeIncidents = computed(() =>
    this.svc.incidents().filter(i => i.estado !== 'cerrado')
  );

  typeEntries = computed(() => {
    const byType = this.stats().byType;
    const total = this.stats().total || 1;
    return Object.entries(byType)
      .sort((a, b) => b[1] - a[1])
      .map(([tipo, count]) => ({
        tipo,
        label: INCIDENT_TYPE_LABELS[tipo as keyof typeof INCIDENT_TYPE_LABELS] ?? tipo,
        count,
        pct: Math.round((count / total) * 100),
      }));
  });

  typeLabel(tipo: string): string {
    return INCIDENT_TYPE_LABELS[tipo as keyof typeof INCIDENT_TYPE_LABELS] ?? tipo;
  }

  statusLabel(estado: string): string {
    const map: Record<string, string> = { abierto: 'Abierto', en_curso: 'En curso', cerrado: 'Cerrado' };
    return map[estado] ?? estado;
  }
}
