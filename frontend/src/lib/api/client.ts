import {
  BloodComponent,
  BloodType,
  Camp,
  DonorProfile,
  EmergencyRequest,
  Hospital,
  HospitalSearchResult,
  InventoryItem,
  UrgencyLevel,
  UserRole,
} from "../types";
import { mockApi } from "./mockService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class ApiClient {
  private useMock: boolean = true;
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const storedMock = localStorage.getItem("lifelink_use_mock");
      if (storedMock !== null) {
        this.useMock = storedMock === "true";
      } else {
        this.useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
      }
      this.token = localStorage.getItem("lifelink_token");
    }
  }

  isMockMode(): boolean {
    return this.useMock;
  }

  setMockMode(enabled: boolean): void {
    this.useMock = enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("lifelink_use_mock", enabled ? "true" : "false");
    }
  }

  setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("lifelink_token", token);
      else localStorage.removeItem("lifelink_token");
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined" && !this.token) {
      this.token = localStorage.getItem("lifelink_token");
    }
    return this.token;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errDetail = "API request failed";
      try {
        const errorJson = await res.json();
        errDetail = errorJson.detail || errorJson.message || errDetail;
      } catch {
        // use default error
      }
      throw new Error(errDetail);
    }

    return res.json();
  }

  // --- Auth ---
  async login(
    email: string,
    password?: string
  ): Promise<{ token: string; role: UserRole; id: string; name: string }> {
    if (this.useMock) {
      const res = await mockApi.login(email);
      this.setToken(res.token);
      return res;
    }
    const res = await this.request<{ token: string; role: UserRole; id: string; name: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password: password || "password123" }),
      }
    );
    this.setToken(res.token);
    return res;
  }

  async signup(data: {
    email: string;
    password: string;
    role: UserRole;
    name: string;
  }): Promise<{ id: string; email: string; role: string; token: string }> {
    if (this.useMock) {
      return {
        id: `usr_${Date.now()}`,
        email: data.email,
        role: data.role,
        token: `mock-jwt-${data.role}-${Date.now()}`,
      };
    }
    const res = await this.request<{ id: string; email: string; role: string; token: string }>(
      "/auth/signup",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    this.setToken(res.token);
    return res;
  }

  // --- Donors ---
  async getDonorMe(userId: string): Promise<DonorProfile> {
    if (this.useMock) {
      return mockApi.getDonorProfile(userId);
    }
    return this.request<DonorProfile>("/donors/me");
  }

  async updateDonorProfile(
    userId: string,
    data: { blood_type: BloodType; latitude: number; longitude: number; available: boolean; name?: string; city?: string }
  ): Promise<DonorProfile> {
    if (this.useMock) {
      return mockApi.updateDonorProfile(userId, data);
    }
    return this.request<DonorProfile>("/donors/profile", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDonorAvailability(userId: string, available: boolean): Promise<{ available: boolean }> {
    if (this.useMock) {
      return mockApi.updateAvailability(userId, available);
    }
    return this.request<{ available: boolean }>("/donors/availability", {
      method: "PATCH",
      body: JSON.stringify({ available }),
    });
  }

  // --- Hospitals ---
  async getHospitalList(): Promise<Hospital[]> {
    if (this.useMock) {
      return mockApi.getHospitalsList();
    }
    return this.request<Hospital[]>("/hospitals");
  }

  async getHospital(id: string): Promise<Hospital | undefined> {
    if (this.useMock) {
      return mockApi.getHospital(id);
    }
    return this.request<Hospital>(`/hospitals/${id}`);
  }

  async getHospitalInventory(hospitalId: string): Promise<InventoryItem[]> {
    if (this.useMock) {
      return mockApi.getInventory(hospitalId);
    }
    return this.request<InventoryItem[]>(`/hospitals/${hospitalId}/inventory`);
  }

  async updateHospitalInventory(
    hospitalId: string,
    data: { blood_type: BloodType; component: BloodComponent; units: number }
  ): Promise<InventoryItem> {
    if (this.useMock) {
      return mockApi.updateInventory(hospitalId, data);
    }
    return this.request<InventoryItem>(`/hospitals/${hospitalId}/inventory`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async searchHospitals(params: {
    blood_type?: BloodType;
    component?: BloodComponent;
    lat?: number;
    lng?: number;
    radius_km?: number;
  }): Promise<HospitalSearchResult[]> {
    if (this.useMock) {
      return mockApi.searchHospitals(params);
    }
    const query = new URLSearchParams();
    if (params.blood_type) query.set("blood_type", params.blood_type);
    if (params.component) query.set("component", params.component);
    if (params.lat) query.set("lat", params.lat.toString());
    if (params.lng) query.set("lng", params.lng.toString());
    if (params.radius_km) query.set("radius_km", params.radius_km.toString());

    return this.request<HospitalSearchResult[]>(`/hospitals/search?${query.toString()}`);
  }

  // --- Emergency Requests ---
  async createEmergencyRequest(
    hospitalId: string,
    data: {
      blood_type: BloodType;
      component: BloodComponent;
      units_needed: number;
      urgency: UrgencyLevel;
      radius_km: number;
    }
  ): Promise<EmergencyRequest> {
    if (this.useMock) {
      return mockApi.createRequest(hospitalId, data);
    }
    return this.request<EmergencyRequest>("/requests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getEmergencyRequest(id: string): Promise<EmergencyRequest | undefined> {
    if (this.useMock) {
      return mockApi.getRequestById(id);
    }
    return this.request<EmergencyRequest>(`/requests/${id}`);
  }

  async getEmergencyRequestsList(hospitalId?: string): Promise<EmergencyRequest[]> {
    if (this.useMock) {
      return mockApi.getRequestsList(hospitalId);
    }
    return this.request<EmergencyRequest[]>("/requests");
  }

  async getDonorAlerts(donorId: string): Promise<EmergencyRequest[]> {
    if (this.useMock) {
      return mockApi.getDonorRequests(donorId);
    }
    return this.request<EmergencyRequest[]>("/requests");
  }

  async respondToRequest(
    requestId: string,
    donorId: string,
    response: "confirmed" | "declined"
  ): Promise<{ success: boolean; request: EmergencyRequest }> {
    if (this.useMock) {
      return mockApi.respondToRequest(requestId, donorId, response);
    }
    return this.request<{ success: boolean; request: EmergencyRequest }>(
      `/requests/${requestId}/respond`,
      {
        method: "POST",
        body: JSON.stringify({ response }),
      }
    );
  }

  // --- Camps ---
  async getCamps(params?: { lat?: number; lng?: number; radius_km?: number }): Promise<Camp[]> {
    if (this.useMock) {
      return mockApi.getCamps(params);
    }
    const query = new URLSearchParams();
    if (params?.lat) query.set("lat", params.lat.toString());
    if (params?.lng) query.set("lng", params.lng.toString());
    if (params?.radius_km) query.set("radius_km", params.radius_km.toString());
    return this.request<Camp[]>(`/camps?${query.toString()}`);
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
    if (this.useMock) {
      return mockApi.createCamp(ngoId, data);
    }
    return this.request<Camp>("/camps", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
