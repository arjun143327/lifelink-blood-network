import {
  Hospital,
  DonorProfile,
  InventoryItem,
  EmergencyRequest,
  Camp,
  BloodType,
  BloodComponent,
  UrgencyLevel,
  DonorResponseStatus,
  HospitalSearchResult,
  UserRole,
} from "../types";
import {
  INITIAL_HOSPITALS,
  INITIAL_DONORS,
  INITIAL_INVENTORY,
  INITIAL_REQUESTS,
  INITIAL_CAMPS,
} from "./mockData";
import { calculateDistance, canReceiveRedCells } from "../utils";

// LocalStorage persistence keys
const STORAGE_KEYS = {
  HOSPITALS: "lifelink_hospitals_v1",
  DONORS: "lifelink_donors_v1",
  INVENTORY: "lifelink_inventory_v1",
  REQUESTS: "lifelink_requests_v1",
  CAMPS: "lifelink_camps_v1",
};

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to persist ${key}`, err);
  }
}

class MockApiService {
  private getHospitals(): Hospital[] {
    return getStored<Hospital[]>(STORAGE_KEYS.HOSPITALS, INITIAL_HOSPITALS);
  }

  private saveHospitals(data: Hospital[]): void {
    setStored(STORAGE_KEYS.HOSPITALS, data);
  }

  private getDonors(): DonorProfile[] {
    return getStored<DonorProfile[]>(STORAGE_KEYS.DONORS, INITIAL_DONORS);
  }

  private saveDonors(data: DonorProfile[]): void {
    setStored(STORAGE_KEYS.DONORS, data);
  }

  private getAllInventory(): Record<string, InventoryItem[]> {
    return getStored<Record<string, InventoryItem[]>>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  }

  private saveAllInventory(data: Record<string, InventoryItem[]>): void {
    setStored(STORAGE_KEYS.INVENTORY, data);
  }

  private getRequests(): EmergencyRequest[] {
    return getStored<EmergencyRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  }

  private saveRequests(data: EmergencyRequest[]): void {
    setStored(STORAGE_KEYS.REQUESTS, data);
  }

  private loadStoredCamps(): Camp[] {
    return getStored<Camp[]>(STORAGE_KEYS.CAMPS, INITIAL_CAMPS);
  }

  private saveCamps(data: Camp[]): void {
    setStored(STORAGE_KEYS.CAMPS, data);
  }

  // Reset all state to clean initial values
  resetAll(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.HOSPITALS);
    localStorage.removeItem(STORAGE_KEYS.DONORS);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.CAMPS);
  }

  // --- Auth endpoints ---
  async login(email: string): Promise<{ token: string; role: UserRole; id: string; name: string }> {
    await new Promise((res) => setTimeout(res, 200));

    // Check if hospital admin
    const hospitals = this.getHospitals();
    const hosp = hospitals.find((h) => h.id === email || h.user_id === email || email.includes("apollo") || email.includes("hospital"));
    if (hosp) {
      return {
        token: `jwt_mock_${hosp.id}`,
        role: "hospital_admin",
        id: hosp.user_id,
        name: hosp.name,
      };
    }

    // Check if NGO
    if (email.includes("redcross") || email.includes("ngo")) {
      return {
        token: "jwt_mock_ngo_1",
        role: "ngo_admin",
        id: "usr_ngo_1",
        name: "Indian Red Cross Society",
      };
    }

    // Default to Donor
    const donors = this.getDonors();
    const donor = donors.find((d) => d.email.toLowerCase() === email.toLowerCase()) || donors[0];
    return {
      token: `jwt_mock_${donor.id}`,
      role: "donor",
      id: donor.user_id,
      name: donor.name,
    };
  }

  // --- Donor endpoints ---
  async getDonorProfile(userId: string): Promise<DonorProfile> {
    await new Promise((res) => setTimeout(res, 150));
    const donors = this.getDonors();
    const donor = donors.find((d) => d.user_id === userId || d.id === userId);
    if (!donor) return donors[0]; // fallback
    return donor;
  }

  async updateDonorProfile(
    userId: string,
    updates: Partial<DonorProfile>
  ): Promise<DonorProfile> {
    await new Promise((res) => setTimeout(res, 200));
    const donors = this.getDonors();
    const idx = donors.findIndex((d) => d.user_id === userId || d.id === userId);
    if (idx === -1) {
      const newDonor: DonorProfile = {
        id: `donor_${Date.now()}`,
        user_id: userId,
        name: updates.name || "Registered Donor",
        email: updates.email || "donor@example.com",
        blood_type: updates.blood_type || "O+",
        latitude: updates.latitude ?? 12.9716,
        longitude: updates.longitude ?? 77.5946,
        city: updates.city || "Bengaluru",
        available: updates.available ?? true,
        updated_at: new Date().toISOString(),
      };
      donors.push(newDonor);
      this.saveDonors(donors);
      return newDonor;
    }

    donors[idx] = {
      ...donors[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveDonors(donors);
    return donors[idx];
  }

  async updateAvailability(userId: string, available: boolean): Promise<{ available: boolean }> {
    await new Promise((res) => setTimeout(res, 150));
    const donors = this.getDonors();
    const donor = donors.find((d) => d.user_id === userId || d.id === userId);
    if (donor) {
      donor.available = available;
      donor.updated_at = new Date().toISOString();
      this.saveDonors(donors);
    }
    return { available };
  }

  // --- Hospital endpoints ---
  async getHospitalsList(): Promise<Hospital[]> {
    return this.getHospitals();
  }

  async getHospital(hospitalId: string): Promise<Hospital | undefined> {
    return this.getHospitals().find((h) => h.id === hospitalId || h.user_id === hospitalId);
  }

  async getInventory(hospitalId: string): Promise<InventoryItem[]> {
    await new Promise((res) => setTimeout(res, 150));
    const all = this.getAllInventory();
    return all[hospitalId] || [];
  }

  async updateInventory(
    hospitalId: string,
    data: { blood_type: BloodType; component: BloodComponent; units: number }
  ): Promise<InventoryItem> {
    await new Promise((res) => setTimeout(res, 200));
    const all = this.getAllInventory();
    const list = all[hospitalId] || [];
    const idx = list.findIndex(
      (item) => item.blood_type === data.blood_type && item.component === data.component
    );

    const updatedItem: InventoryItem = {
      id: list[idx]?.id || `inv_${hospitalId}_${data.blood_type}_${data.component}`,
      hospital_id: hospitalId,
      blood_type: data.blood_type,
      component: data.component,
      units: Math.max(0, data.units),
      updated_at: new Date().toISOString(),
    };

    if (idx >= 0) {
      list[idx] = updatedItem;
    } else {
      list.push(updatedItem);
    }

    all[hospitalId] = list;
    this.saveAllInventory(all);
    return updatedItem;
  }

  async searchHospitals(params: {
    blood_type?: BloodType;
    component?: BloodComponent;
    lat?: number;
    lng?: number;
    radius_km?: number;
  }): Promise<HospitalSearchResult[]> {
    await new Promise((res) => setTimeout(res, 250));
    const hospitals = this.getHospitals();
    const inventory = this.getAllInventory();
    const results: HospitalSearchResult[] = [];

    const centerLat = params.lat ?? 12.9716; // default Bengaluru center
    const centerLng = params.lng ?? 77.5946;
    const maxRadius = params.radius_km ?? 50;

    for (const hosp of hospitals) {
      const distance = calculateDistance(centerLat, centerLng, hosp.latitude, hosp.longitude);
      if (distance > maxRadius) continue;

      const hospInv = inventory[hosp.id] || [];
      for (const item of hospInv) {
        if (params.blood_type && item.blood_type !== params.blood_type) continue;
        if (params.component && item.component !== params.component) continue;
        if (item.units <= 0) continue;

        results.push({
          hospital_id: hosp.id,
          hospital_name: hosp.name,
          city: hosp.city,
          address: hosp.address,
          phone: hosp.phone,
          distance_km: distance,
          blood_type: item.blood_type,
          component: item.component,
          units: item.units,
          updated_at: item.updated_at,
          latitude: hosp.latitude,
          longitude: hosp.longitude,
        });
      }
    }

    // Sort by distance
    results.sort((a, b) => a.distance_km - b.distance_km);
    return results;
  }

  // --- Emergency Requests endpoints ---
  async createRequest(
    hospitalId: string,
    data: {
      blood_type: BloodType;
      component: BloodComponent;
      units_needed: number;
      urgency: UrgencyLevel;
      radius_km: number;
    }
  ): Promise<EmergencyRequest> {
    await new Promise((res) => setTimeout(res, 350));
    const hospitals = this.getHospitals();
    const hosp = hospitals.find((h) => h.id === hospitalId || h.user_id === hospitalId) || hospitals[0];

    const donors = this.getDonors();

    // Spatial & availability donor matching (PostGIS equivalent in frontend mock)
    const matchedDonors = donors
      .filter((d) => d.available)
      .filter((d) => canReceiveRedCells(data.blood_type, d.blood_type))
      .map((d) => ({
        donor_id: d.id,
        name: d.name,
        blood_type: d.blood_type,
        phone: d.phone,
        distance_km: calculateDistance(
          hosp.latitude,
          hosp.longitude,
          d.latitude,
          d.longitude
        ),
        response: "pending" as DonorResponseStatus,
        responded_at: null,
      }))
      .filter((d) => d.distance_km <= data.radius_km)
      .sort((a, b) => a.distance_km - b.distance_km);

    const newReq: EmergencyRequest = {
      id: `req_${Date.now()}`,
      hospital_id: hosp.id,
      hospital_name: hosp.name,
      hospital_city: hosp.city,
      hospital_phone: hosp.phone,
      hospital_location: {
        lat: hosp.latitude,
        lng: hosp.longitude,
      },
      blood_type: data.blood_type,
      component: data.component,
      units_needed: data.units_needed,
      urgency: data.urgency,
      radius_km: data.radius_km,
      status: "open",
      created_at: new Date().toISOString(),
      matched_donor_count: matchedDonors.length,
      matched_donors: matchedDonors,
    };

    const requests = this.getRequests();
    requests.unshift(newReq);
    this.saveRequests(requests);
    return newReq;
  }

  async getRequestById(id: string): Promise<EmergencyRequest | undefined> {
    await new Promise((res) => setTimeout(res, 150));
    return this.getRequests().find((r) => r.id === id);
  }

  async getRequestsList(hospitalId?: string): Promise<EmergencyRequest[]> {
    await new Promise((res) => setTimeout(res, 150));
    const all = this.getRequests();
    if (hospitalId) {
      return all.filter((r) => r.hospital_id === hospitalId);
    }
    return all;
  }

  async getDonorRequests(donorId: string): Promise<EmergencyRequest[]> {
    await new Promise((res) => setTimeout(res, 150));
    const all = this.getRequests();
    // Return requests where this donor is in matched_donors or within range
    return all.filter(
      (r) =>
        r.matched_donors?.some((m) => m.donor_id === donorId) ||
        r.status === "open"
    );
  }

  async respondToRequest(
    requestId: string,
    donorId: string,
    response: "confirmed" | "declined"
  ): Promise<{ success: boolean; request: EmergencyRequest }> {
    await new Promise((res) => setTimeout(res, 250));
    const requests = this.getRequests();
    const req = requests.find((r) => r.id === requestId);
    if (!req) throw new Error("Emergency request not found");

    if (!req.matched_donors) req.matched_donors = [];

    const existingMatch = req.matched_donors.find((m) => m.donor_id === donorId);
    if (existingMatch) {
      existingMatch.response = response;
      existingMatch.responded_at = new Date().toISOString();
    } else {
      // Add if wasn't explicitly in list
      const donors = this.getDonors();
      const donor = donors.find((d) => d.id === donorId || d.user_id === donorId);
      req.matched_donors.push({
        donor_id: donorId,
        name: donor ? donor.name : "Volunteer Donor",
        blood_type: donor ? donor.blood_type : "O+",
        phone: donor?.phone,
        distance_km: donor
          ? calculateDistance(req.hospital_location.lat, req.hospital_location.lng, donor.latitude, donor.longitude)
          : 3.5,
        response: response,
        responded_at: new Date().toISOString(),
      });
    }

    this.saveRequests(requests);
    return { success: true, request: req };
  }

  // --- Camps endpoints ---
  async getCamps(params?: { lat?: number; lng?: number; radius_km?: number }): Promise<Camp[]> {
    await new Promise((res) => setTimeout(res, 200));
    const camps = this.loadStoredCamps();
    if (!params?.lat || !params?.lng) return camps;

    const maxRadius = params.radius_km ?? 30;
    return camps.filter((c) => {
      const dist = calculateDistance(params.lat!, params.lng!, c.location.lat, c.location.lng);
      return dist <= maxRadius;
    });
  }

  async createCamp(
    ngoId: string,
    data: {
      title: string;
      location: { lat: number; lng: number; address: string; city: string };
      date: string;
      time?: string;
      target_blood_types: BloodType[];
      expected_donors?: number;
      contact_phone?: string;
    }
  ): Promise<Camp> {
    await new Promise((res) => setTimeout(res, 250));
    const camps = this.loadStoredCamps();
    const newCamp: Camp = {
      id: `camp_${Date.now()}`,
      ngo_id: ngoId,
      ngo_name: "Community Health Initiative",
      title: data.title,
      location: data.location,
      date: data.date,
      time: data.time || "09:00 AM - 04:00 PM",
      target_blood_types: data.target_blood_types,
      expected_donors: data.expected_donors || 100,
      registered_count: 0,
      contact_phone: data.contact_phone || "+91 99000 11223",
    };

    camps.unshift(newCamp);
    this.saveCamps(camps);
    return newCamp;
  }
}

export const mockApi = new MockApiService();
