export interface User {
  username: string;
  role: string;
  is_superuser: boolean;
  is_active: boolean;
  id: string;
}

export interface UserValues {
  username: string;
  password: string;
}
export interface Patient {
  birthday?: string;
  gender?: "м" | "ж";
  full_name?: string;
  living_place?: string;
  job_title?: string;
  inhabited_locality?: "Город" | "Район";
  bp?: boolean;
  ischemia?: boolean;
  dep?: boolean;
  id?: string;
  therapist_id?: string;
}

export interface PatientRecord {
  visit: string;
  diagnosis: string;
  treatment: string;
  patient_id: string;
  id: string;
}

export type FormFilterConfig = {
  filter: {
    field: string;
    value: string | number | Date | boolean;
    rule: string;
  }[];
};
