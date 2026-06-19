export type IncidentType =
  | 'afectacion_marejadas'
  | 'afectacion_neblina'
  | 'afectacion_viento'
  | 'cierre_puerto'
  | 'paro_manifestacion'
  | 'incidente_operacional'
  | 'accidente'
  | 'mantenimiento_atraque'
  | 'razones_sanitarias'
  | 'otro';

export type IncidentAction = 'NUEVO' | 'ACTUALIZACION';
export type IncidentStatus = 'abierto' | 'en_curso' | 'cerrado';

export interface Incident {
  id: string;
  fechaReporte: Date;
  fechaInicio: Date;
  fechaEstimadaTermino?: Date;
  tipo: IncidentType;
  observacion: string;
  accion: IncidentAction;
  estado: IncidentStatus;
  sitioAfectado?: string;
  reportadoPor: string;
  createdAt: Date;
  updatedAt: Date;
}

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  afectacion_marejadas: 'Afectación por marejadas',
  afectacion_neblina: 'Afectación por neblina',
  afectacion_viento: 'Afectación por viento',
  cierre_puerto: 'Cierre de puerto',
  paro_manifestacion: 'Paro / manifestación',
  incidente_operacional: 'Incidente operacional',
  accidente: 'Accidente',
  mantenimiento_atraque: 'Mantenimiento frente de atraque',
  razones_sanitarias: 'Razones sanitarias',
  otro: 'Otro',
};

export const INCIDENT_STATUS_LABELS: Record<IncidentStatus, string> = {
  abierto: 'Abierto',
  en_curso: 'En curso',
  cerrado: 'Cerrado',
};

export const SITIOS = ['STI', 'DPW', 'Puerto Panul', 'QC Policarpo Toro'];
