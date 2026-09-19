// TypeScript types strictly aligned with API_CONTRACT.md & DATABASE_SCHEMA.md

export type UserRole = 'donor' | 'hospital_admin' | 'ngo_admin' | 'public';

export type BloodType = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

export type BloodComponent = 'whole_blood' | 'plasma' | 'platelets';

export type UrgencyLevel = 'critical' | 'high' | 'normal';

export type RequestStatus = 'open' | 'fulfilled' | 'expired';

export type DonorResponseStatus = 'pending' | 'confirmed' | 'declined';

export interface User {
  id: string;
  user_id?: string;
  email: string;
  name: string;
  role: UserRole;
  token?: string;
  created_at?: string;
}

export interface DonorProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  blood_type: BloodType;
  latitude: number;
  longitude: number;
  city: string;
  available: boolean;
  last_donated?: string;
  donation_count?: number;
  updated_at?: string;
}

export interface Hospital {
  id: string;
  user_id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  verified: boolean;
}

export interface InventoryItem {
  id?: string;
  hospital_id?: string;
  hospital_name?: string;
  blood_type: BloodType;
  component: BloodComponent;
  units: number;
  updated_at: string;
}

export interface MatchedDonor {
  donor_id: string;
  name: string;
  blood_type: BloodType;
  phone?: string;
  distance_km: number;
  response: DonorResponseStatus;
  responded_at?: string | null;
}

export interface EmergencyRequest {
  id: string;
  hospital_id: string;
  hospital_name: string;
  hospital_city: string;
  hospital_phone?: string;
  hospital_location: {
    lat: number;
    lng: number;
  };
  blood_type: BloodType;
  component: BloodComponent;
  units_needed: number;
  urgency: UrgencyLevel;
  radius_km: number;
  status: RequestStatus;
  created_at: string;
  matched_donor_count?: number;
  matched_donors?: MatchedDonor[];
}

export interface Camp {
  id: string;
  ngo_id: string;
  ngo_name: string;
  title: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  };
  date: string;
  time?: string;
  target_blood_types: BloodType[];
  expected_donors?: number;
  registered_count?: number;
  contact_phone?: string;
}

export interface HospitalSearchResult {
  hospital_id: string;
  hospital_name: string;
  city: string;
  address: string;
  phone: string;
  distance_km: number;
  blood_type: BloodType;
  component: BloodComponent;
  units: number;
  updated_at: string;
  latitude: number;
  longitude: number;
}
