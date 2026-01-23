
export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  color?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export type AgreementTone = 'Divertido' | 'Ácido' | 'Neutro';

export type AgreementCategory = 'Casais' | 'Amigos' | 'Casa' | 'Financeiro' | 'Família' | 'Outros';

export enum AgreementStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DRAFT = 'draft',
  COMPLETED = 'completed',
  FAILED = 'failed',
  WAITING_SIGNATURES = 'waiting_signatures'
}

export interface Agreement {
  id: string;
  created_by: string;
  title: string;
  description: string;
  tone: AgreementTone;
  category: AgreementCategory;
  validity: string;
  penalty?: string;
  status: AgreementStatus;
  participants?: Participant[];
  agreement_participants?: any[]; // Joined data from Supabase
  rules?: string[];
  signatures?: any;
  initial_signature_creator?: string;
  initial_signature_partner?: string;
  signed_at?: string;
  negotiation_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Suggestion {
  text: string;
}
