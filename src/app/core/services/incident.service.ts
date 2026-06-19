import { Injectable, signal, computed } from '@angular/core';
import { Incident, IncidentType, IncidentStatus } from '../models/incident.model';

const MOCK_INCIDENTS: Incident[] = [
  {
    id: '1',
    fechaReporte: new Date('2026-06-01T08:30:00'),
    fechaInicio: new Date('2026-06-01T06:00:00'),
    fechaEstimadaTermino: new Date('2026-06-01T14:00:00'),
    tipo: 'afectacion_marejadas',
    observacion: 'Oleaje superior a 2.5 metros. Operación suspendida temporalmente en sitio STI.',
    accion: 'NUEVO',
    estado: 'cerrado',
    sitioAfectado: 'STI',
    reportadoPor: 'J. Fuentes',
    createdAt: new Date('2026-06-01T08:30:00'),
    updatedAt: new Date('2026-06-01T14:10:00'),
  },
  {
    id: '2',
    fechaReporte: new Date('2026-06-03T11:00:00'),
    fechaInicio: new Date('2026-06-03T10:45:00'),
    tipo: 'paro_manifestacion',
    observacion: 'Protesta de pescadores artesanales en la bahía. Acceso restringido.',
    accion: 'NUEVO',
    estado: 'cerrado',
    sitioAfectado: 'Puerto Panul',
    reportadoPor: 'M. Rojas',
    createdAt: new Date('2026-06-03T11:00:00'),
    updatedAt: new Date('2026-06-03T16:00:00'),
  },
  {
    id: '3',
    fechaReporte: new Date('2026-06-07T09:15:00'),
    fechaInicio: new Date('2026-06-07T07:30:00'),
    fechaEstimadaTermino: new Date('2026-06-07T18:00:00'),
    tipo: 'mantenimiento_atraque',
    observacion: 'Trabajos de mantención programada en muelle sur. Sitio C2 fuera de servicio.',
    accion: 'NUEVO',
    estado: 'cerrado',
    sitioAfectado: 'DPW',
    reportadoPor: 'P. Vidal',
    createdAt: new Date('2026-06-07T09:15:00'),
    updatedAt: new Date('2026-06-07T18:05:00'),
  },
  {
    id: '4',
    fechaReporte: new Date('2026-06-10T14:20:00'),
    fechaInicio: new Date('2026-06-10T14:00:00'),
    tipo: 'incidente_operacional',
    observacion: 'Falla de grúa pórtico en terminal. Operación de descarga suspendida.',
    accion: 'NUEVO',
    estado: 'en_curso',
    sitioAfectado: 'STI',
    reportadoPor: 'J. Fuentes',
    createdAt: new Date('2026-06-10T14:20:00'),
    updatedAt: new Date('2026-06-10T14:20:00'),
  },
  {
    id: '5',
    fechaReporte: new Date('2026-06-12T06:00:00'),
    fechaInicio: new Date('2026-06-12T04:00:00'),
    fechaEstimadaTermino: new Date('2026-06-12T12:00:00'),
    tipo: 'cierre_puerto',
    observacion: 'Puerto cerrado por la Autoridad Marítima debido a condiciones de temporal.',
    accion: 'NUEVO',
    estado: 'en_curso',
    reportadoPor: 'M. Rojas',
    createdAt: new Date('2026-06-12T06:00:00'),
    updatedAt: new Date('2026-06-12T06:00:00'),
  },
  {
    id: '6',
    fechaReporte: new Date('2026-06-15T16:45:00'),
    fechaInicio: new Date('2026-06-15T16:30:00'),
    tipo: 'accidente',
    observacion: 'Accidente de estibador en bodega de nave. Evacuación médica realizada.',
    accion: 'NUEVO',
    estado: 'abierto',
    sitioAfectado: 'QC Policarpo Toro',
    reportadoPor: 'P. Vidal',
    createdAt: new Date('2026-06-15T16:45:00'),
    updatedAt: new Date('2026-06-15T16:45:00'),
  },
  {
    id: '7',
    fechaReporte: new Date('2026-06-17T08:00:00'),
    fechaInicio: new Date('2026-06-17T07:00:00'),
    tipo: 'afectacion_viento',
    observacion: 'Vientos sobre 40 nudos. Pilot suspendió maniobra de atraque.',
    accion: 'NUEVO',
    estado: 'abierto',
    sitioAfectado: 'DPW',
    reportadoPor: 'J. Fuentes',
    createdAt: new Date('2026-06-17T08:00:00'),
    updatedAt: new Date('2026-06-17T08:00:00'),
  },
];

@Injectable({ providedIn: 'root' })
export class IncidentService {
  private _incidents = signal<Incident[]>(MOCK_INCIDENTS);

  readonly incidents = this._incidents.asReadonly();

  readonly stats = computed(() => {
    const all = this._incidents();
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = { abierto: 0, en_curso: 0, cerrado: 0 };

    for (const inc of all) {
      byType[inc.tipo] = (byType[inc.tipo] ?? 0) + 1;
      byStatus[inc.estado]++;
    }

    return {
      total: all.length,
      abiertos: byStatus['abierto'],
      enCurso: byStatus['en_curso'],
      cerrados: byStatus['cerrado'],
      byType,
    };
  });

  getById(id: string): Incident | undefined {
    return this._incidents().find(i => i.id === id);
  }

  create(data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>): Incident {
    const now = new Date();
    const newIncident: Incident = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this._incidents.update(list => [newIncident, ...list]);
    return newIncident;
  }

  update(id: string, data: Partial<Incident>): void {
    this._incidents.update(list =>
      list.map(i => i.id === id ? { ...i, ...data, updatedAt: new Date() } : i)
    );
  }

  filterByStatus(status: IncidentStatus | 'todos'): Incident[] {
    if (status === 'todos') return this._incidents();
    return this._incidents().filter(i => i.estado === status);
  }

  filterByType(type: IncidentType | 'todos'): Incident[] {
    if (type === 'todos') return this._incidents();
    return this._incidents().filter(i => i.tipo === type);
  }
}
