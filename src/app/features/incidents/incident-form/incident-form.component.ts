import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { IncidentService } from '../../../core/services/incident.service';
import {
  Incident, IncidentType, IncidentAction, IncidentStatus,
  INCIDENT_TYPE_LABELS, SITIOS
} from '../../../core/models/incident.model';

interface IncidentFormModel {
  tipo: IncidentType | '';
  accion: IncidentAction;
  estado: IncidentStatus;
  observacion: string;
  reportadoPor: string;
  sitioAfectado: string;
  fechaInicio: string;
  fechaEstimadaTermino: string;
}

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ isEdit ? 'Actualizar incidente' : 'Registrar incidente' }}</h1>
          <p class="page-sub">{{ isEdit ? 'Modificar datos del incidente existente' : 'Nuevo incidente o evento disruptivo' }}</p>
        </div>
        <a routerLink="/incidents" class="btn-back">← Volver al listado</a>
      </div>

      <div class="card">
        <form (ngSubmit)="submit()" #f="ngForm">
          <div class="form-grid">

            <div class="field">
              <label class="label">Tipo de incidente <span class="req">*</span></label>
              <select [(ngModel)]="form.tipo" name="tipo" required class="input">
                <option value="">Seleccionar tipo...</option>
                @for (entry of typeOptions; track entry.value) {
                  <option [value]="entry.value">{{ entry.label }}</option>
                }
              </select>
            </div>

            <div class="field">
              <label class="label">Acción <span class="req">*</span></label>
              <select [(ngModel)]="form.accion" name="accion" required class="input">
                <option value="NUEVO">NUEVO</option>
                <option value="ACTUALIZACION">ACTUALIZACIÓN</option>
              </select>
            </div>

            <div class="field">
              <label class="label">Fecha inicio <span class="req">*</span></label>
              <input type="datetime-local" [(ngModel)]="form.fechaInicio" name="fechaInicio" required class="input" />
            </div>

            <div class="field">
              <label class="label">Fecha estimada término</label>
              <input type="datetime-local" [(ngModel)]="form.fechaEstimadaTermino" name="fechaEstimadaTermino" class="input" />
            </div>

            <div class="field">
              <label class="label">Sitio afectado</label>
              <select [(ngModel)]="form.sitioAfectado" name="sitioAfectado" class="input">
                <option value="">Sin sitio específico</option>
                @for (s of sitios; track s) {
                  <option [value]="s">{{ s }}</option>
                }
              </select>
            </div>

            <div class="field">
              <label class="label">Estado <span class="req">*</span></label>
              <select [(ngModel)]="form.estado" name="estado" required class="input">
                <option value="abierto">Abierto</option>
                <option value="en_curso">En curso</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>

            <div class="field">
              <label class="label">Reportado por <span class="req">*</span></label>
              <input type="text" [(ngModel)]="form.reportadoPor" name="reportadoPor" required
                     placeholder="Nombre del operador" class="input" />
            </div>

            <div class="field field-full">
              <label class="label">Observación <span class="req">*</span></label>
              <textarea [(ngModel)]="form.observacion" name="observacion" required rows="4"
                        placeholder="Descripción del evento o actualización..." class="input textarea"></textarea>
            </div>

          </div>

          @if (successMsg()) {
            <div class="alert alert-ok">✓ {{ successMsg() }}</div>
          }

          <div class="form-actions">
            <a routerLink="/incidents" class="btn-cancel">Cancelar</a>
            <button type="submit" [disabled]="f.invalid" class="btn-submit">
              {{ isEdit ? 'Guardar cambios' : 'Registrar incidente' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 760px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .page-title { font-size: 24px; font-weight: 700; color: #0C2D4A; margin: 0 0 4px; }
    .page-sub { font-size: 14px; color: #64748B; margin: 0; }
    .btn-back { color: #0C447C; text-decoration: none; font-size: 14px; font-weight: 600; }
    .btn-back:hover { text-decoration: underline; }

    .card { background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-full { grid-column: 1 / -1; }
    .label { font-size: 13px; font-weight: 600; color: #374151; }
    .req { color: #DC2626; }
    .input {
      padding: 9px 12px; border: 1px solid #CBD5E1; border-radius: 8px;
      font-size: 14px; color: #1E293B; background: #fff; transition: border 0.15s;
    }
    .input:focus { outline: none; border-color: #0C447C; box-shadow: 0 0 0 3px rgba(12,68,124,0.1); }
    .textarea { resize: vertical; font-family: inherit; }

    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 28px; }
    .btn-cancel {
      padding: 10px 20px; border-radius: 8px; border: 1px solid #CBD5E1;
      color: #64748B; text-decoration: none; font-size: 14px; font-weight: 600;
    }
    .btn-cancel:hover { background: #F8FAFC; }
    .btn-submit {
      padding: 10px 24px; background: #0C447C; color: #fff; border: none;
      border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;
    }
    .btn-submit:hover { background: #0a3868; }
    .btn-submit:disabled { background: #94A3B8; cursor: not-allowed; }

    .alert { padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-top: 16px; }
    .alert-ok { background: #D1FAE5; color: #065F46; }
  `]
})
export class IncidentFormComponent implements OnInit {
  private svc = inject(IncidentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = false;
  editId: string | null = null;
  successMsg = signal('');
  typeOptions = Object.entries(INCIDENT_TYPE_LABELS).map(([value, label]) => ({ value, label }));
  sitios = SITIOS;

  form: IncidentFormModel = {
    tipo: '',
    accion: 'NUEVO',
    estado: 'abierto',
    observacion: '',
    reportadoPor: '',
    sitioAfectado: '',
    fechaInicio: '',
    fechaEstimadaTermino: '',
  };

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      const inc = this.svc.getById(this.editId);
      if (inc) {
        this.isEdit = true;
        this.form = {
          tipo: inc.tipo,
          accion: inc.accion,
          estado: inc.estado,
          observacion: inc.observacion,
          reportadoPor: inc.reportadoPor,
          sitioAfectado: inc.sitioAfectado ?? '',
          fechaInicio: this.toDatetimeLocal(inc.fechaInicio),
          fechaEstimadaTermino: inc.fechaEstimadaTermino ? this.toDatetimeLocal(inc.fechaEstimadaTermino) : '',
        };
      }
    } else {
      this.form.fechaInicio = this.toDatetimeLocal(new Date());
    }
  }

  submit(): void {
    const sitioAfectado = this.form.sitioAfectado || undefined;
    const fechaEstimadaTermino = this.form.fechaEstimadaTermino
      ? new Date(this.form.fechaEstimadaTermino) : undefined;

    if (this.isEdit && this.editId) {
      this.svc.update(this.editId, {
        tipo: this.form.tipo as IncidentType,
        accion: 'ACTUALIZACION',
        estado: this.form.estado,
        observacion: this.form.observacion,
        reportadoPor: this.form.reportadoPor,
        sitioAfectado,
        fechaInicio: new Date(this.form.fechaInicio),
        fechaEstimadaTermino,
      });
      this.successMsg.set('Incidente actualizado correctamente.');
    } else {
      this.svc.create({
        tipo: this.form.tipo as IncidentType,
        accion: this.form.accion,
        estado: this.form.estado,
        observacion: this.form.observacion,
        reportadoPor: this.form.reportadoPor,
        sitioAfectado,
        fechaReporte: new Date(),
        fechaInicio: new Date(this.form.fechaInicio),
        fechaEstimadaTermino,
      });
      this.successMsg.set('Incidente registrado correctamente.');
    }
    setTimeout(() => this.router.navigate(['/incidents']), 1200);
  }

  private toDatetimeLocal(date: Date): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }
}