// src/types/institution.types.ts
export interface Accreditation {
  nba?: boolean;
  naac?: boolean;
  aicte?: boolean;
  other?: Array<{ value: string }>;
}

export interface Courses {
  undergraduate?: boolean;
  postgraduate?: boolean;
  phd?: boolean;
  other?: Array<{ value: string }>;
}

export interface Institution {
  institution_id: string;
  name: string;
  institution_code?: string;
  establishment_year?: string;
  institution_type?: string;
  address?: string;
  road?: string;
  city?: string;
  state?: string;
  pincode?: string;
  logo?: string;
  affiliated_university?: string;
  contact?: string;
  phone_number?: string;
  alternate_phone_number?: string;
  email?: string;
  official_email?: string;
  officialEmail?: string;
  website?: string;
  website_url?: string;
  websiteUrl?: string;
  accreditation?: Accreditation;
  courses?: Courses;
  status?: boolean;
  department_count?: number;
  coe_count?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface COE {
  coe_id: string;
  institution_id: string;
  institution_name?: string;
  name: string;
  employee_id: string;
  email: string;
  phone_number: string;
  qualification?: string;
  user_id?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  errors?: any;
}

export interface CreateInstitutionData {
  name: string;
  institution_code?: string;
  establishment_year?: string;
  institution_type?: string;
  address?: string;
  road?: string;
  city?: string;
  state?: string;
  pincode?: string;
  logo?: string;
  affiliated_university?: string;
  contact?: string;
  phone_number?: string;
  alternate_phone_number?: string;
  email?: string;
  official_email?: string;
  website?: string;
  website_url?: string;
  accreditation?: Accreditation;
  courses?: Courses;
}

export interface CreateCOEData {
  institution_id: string;
  name: string;
  employee_id: string;
  email: string;
  phone_number: string;
  qualification?: string;
}
