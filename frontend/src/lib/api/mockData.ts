import { Hospital, DonorProfile, InventoryItem, EmergencyRequest, Camp, User } from "../types";

export const INITIAL_USERS: User[] = [
  {
    id: "usr_donor_1",
    email: "rahul.sharma@example.com",
    name: "Rahul Sharma",
    role: "donor",
    token: "mock-jwt-token-donor-1",
  },
  {
    id: "usr_donor_2",
    email: "priya.verma@example.com",
    name: "Priya Verma",
    role: "donor",
    token: "mock-jwt-token-donor-2",
  },
  {
    id: "usr_hospital_1",
    email: "bloodbank@apollo.org",
    name: "Dr. Rajesh Kulkarni (Apollo Admin)",
    role: "hospital_admin",
    token: "mock-jwt-token-hospital-1",
  },
  {
    id: "usr_hospital_2",
    email: "admin@manipal.org",
    name: "Dr. Ananya Sen (Manipal Admin)",
    role: "hospital_admin",
    token: "mock-jwt-token-hospital-2",
  },
  {
    id: "usr_ngo_1",
    email: "coordinator@redcross.org",
    name: "Suresh Menon (Red Cross Society)",
    role: "ngo_admin",
    token: "mock-jwt-token-ngo-1",
  },
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: "hosp_apollo_blr",
    user_id: "usr_hospital_1",
    name: "Apollo Hospital, Bannerghatta",
    city: "Bengaluru",
    address: "154/11, Opp IIMB, Bannerghatta Rd, Bengaluru 560076",
    phone: "+91 80 2630 4050",
    latitude: 12.8931,
    longitude: 77.5979,
    verified: true,
  },
  {
    id: "hosp_manipal_blr",
    user_id: "usr_hospital_2",
    name: "Manipal Hospital, Old Airport Road",
    city: "Bengaluru",
    address: "98, HAL Old Airport Rd, Kodihalli, Bengaluru 560017",
    phone: "+91 80 2502 4444",
    latitude: 12.9587,
    longitude: 77.6493,
    verified: true,
  },
  {
    id: "hosp_fortis_blr",
    user_id: "usr_hospital_3",
    name: "Fortis Hospital, Cunningham Road",
    city: "Bengaluru",
    address: "14, Cunningham Rd, Vasanth Nagar, Bengaluru 560052",
    phone: "+91 80 4199 4444",
    latitude: 12.9863,
    longitude: 77.5947,
    verified: true,
  },
  {
    id: "hosp_victoria_blr",
    user_id: "usr_hospital_4",
    name: "Victoria Hospital (BMCRI)",
    city: "Bengaluru",
    address: "Fort Road, near City Market, Bengaluru 560002",
    phone: "+91 80 2670 1150",
    latitude: 12.9625,
    longitude: 77.5753,
    verified: true,
  },
  {
    id: "hosp_kem_mum",
    user_id: "usr_hospital_5",
    name: "King Edward Memorial (KEM) Hospital",
    city: "Mumbai",
    address: "Acharya Donde Marg, Parel, Mumbai 400012",
    phone: "+91 22 2410 7000",
    latitude: 19.0028,
    longitude: 72.8423,
    verified: true,
  },
  {
    id: "hosp_lilavati_mum",
    user_id: "usr_hospital_6",
    name: "Lilavati Hospital & Research Centre",
    city: "Mumbai",
    address: "A-791, Bandra Reclamation, Bandra West, Mumbai 400050",
    phone: "+91 22 2675 1000",
    latitude: 19.0519,
    longitude: 72.8288,
    verified: true,
  },
  {
    id: "hosp_aiims_del",
    user_id: "usr_hospital_7",
    name: "AIIMS New Delhi (Main Blood Bank)",
    city: "New Delhi",
    address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029",
    phone: "+91 11 2658 8500",
    latitude: 28.5672,
    longitude: 77.2100,
    verified: true,
  },
  {
    id: "hosp_max_del",
    user_id: "usr_hospital_8",
    name: "Max Super Speciality Hospital, Saket",
    city: "New Delhi",
    address: "1, 2, Press Enclave Marg, Saket, New Delhi 110017",
    phone: "+91 11 2651 5050",
    latitude: 28.5273,
    longitude: 77.2144,
    verified: true,
  },
];

export const INITIAL_DONORS: DonorProfile[] = [
  {
    id: "donor_1",
    user_id: "usr_donor_1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98450 12345",
    blood_type: "O-",
    latitude: 12.9050,
    longitude: 77.5850, // ~1.8 km from Apollo Bannerghatta
    city: "Bengaluru",
    available: true,
    last_donated: "2026-06-15",
    donation_count: 6,
    updated_at: new Date().toISOString(),
  },
  {
    id: "donor_2",
    user_id: "usr_donor_2",
    name: "Priya Verma",
    email: "priya.verma@example.com",
    phone: "+91 98860 67890",
    blood_type: "O-",
    latitude: 12.9120,
    longitude: 77.6080, // ~2.3 km from Apollo Bannerghatta
    city: "Bengaluru",
    available: true,
    last_donated: "2026-05-10",
    donation_count: 4,
    updated_at: new Date().toISOString(),
  },
  {
    id: "donor_3",
    user_id: "usr_donor_3",
    name: "Karthik Swamy",
    email: "karthik.s@example.com",
    phone: "+91 97410 99881",
    blood_type: "O+",
    latitude: 12.9352,
    longitude: 77.6245, // Koramangala
    city: "Bengaluru",
    available: true,
    last_donated: "2026-04-20",
    donation_count: 9,
    updated_at: new Date().toISOString(),
  },
  {
    id: "donor_4",
    user_id: "usr_donor_4",
    name: "Sneha Hegde",
    email: "sneha.h@example.com",
    phone: "+91 94480 33221",
    blood_type: "A-",
    latitude: 12.9716,
    longitude: 77.6412, // Indiranagar
    city: "Bengaluru",
    available: true,
    last_donated: "2026-07-02",
    donation_count: 3,
    updated_at: new Date().toISOString(),
  },
  {
    id: "donor_5",
    user_id: "usr_donor_5",
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    phone: "+91 98200 44556",
    blood_type: "O-",
    latitude: 19.0150,
    longitude: 72.8350, // Dadar, Mumbai
    city: "Mumbai",
    available: true,
    last_donated: "2026-06-01",
    donation_count: 8,
    updated_at: new Date().toISOString(),
  },
  {
    id: "donor_6",
    user_id: "usr_donor_6",
    name: "Ananya Iyer",
    email: "ananya.i@example.com",
    phone: "+91 98110 55443",
    blood_type: "B+",
    latitude: 28.5520,
    longitude: 77.2050, // Hauz Khas, Delhi
    city: "New Delhi",
    available: true,
    last_donated: "2026-05-25",
    donation_count: 5,
    updated_at: new Date().toISOString(),
  },
  {
    id: "donor_7",
    user_id: "usr_donor_7",
    name: "Mohammed Zaid",
    email: "m.zaid@example.com",
    phone: "+91 99000 88776",
    blood_type: "AB-",
    latitude: 12.9260,
    longitude: 77.5930, // Jayanagar, Bengaluru
    city: "Bengaluru",
    available: true,
    last_donated: "2026-07-10",
    donation_count: 2,
    updated_at: new Date().toISOString(),
  },
  {
    id: "donor_8",
    user_id: "usr_donor_8",
    name: "Deepak Patel",
    email: "deepak.p@example.com",
    phone: "+91 98765 43210",
    blood_type: "A+",
    latitude: 12.9550,
    longitude: 77.6520, // near Manipal Hospital
    city: "Bengaluru",
    available: true,
    last_donated: "2026-06-18",
    donation_count: 11,
    updated_at: new Date().toISOString(),
  },
];

// Generate standard inventory for a hospital
export function generateHospitalInventory(hospitalId: string, hospitalName: string): InventoryItem[] {
  const bloodTypes: Array<"O-" | "O+" | "A-" | "A+" | "B-" | "B+" | "AB-" | "AB+"> = [
    "O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"
  ];
  const components: Array<"whole_blood" | "plasma" | "platelets"> = [
    "whole_blood", "plasma", "platelets"
  ];
  const items: InventoryItem[] = [];

  bloodTypes.forEach((bType) => {
    components.forEach((comp) => {
      // Deterministic realistic stock based on blood scarcity
      let baseUnits = 12;
      if (bType === "O-" || bType === "AB-") baseUnits = 2; // critically low
      else if (bType === "O+" || bType === "B+") baseUnits = 24; // more available
      else if (bType === "A-") baseUnits = 4;
      else baseUnits = 14;

      if (comp === "platelets") baseUnits = Math.max(1, Math.floor(baseUnits / 3)); // short shelf life

      items.push({
        id: `inv_${hospitalId}_${bType}_${comp}`,
        hospital_id: hospitalId,
        hospital_name: hospitalName,
        blood_type: bType,
        component: comp,
        units: baseUnits,
        updated_at: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
      });
    });
  });

  return items;
}

export const INITIAL_INVENTORY: Record<string, InventoryItem[]> = {
  hosp_apollo_blr: generateHospitalInventory("hosp_apollo_blr", "Apollo Hospital, Bannerghatta"),
  hosp_manipal_blr: generateHospitalInventory("hosp_manipal_blr", "Manipal Hospital, Old Airport Road"),
  hosp_fortis_blr: generateHospitalInventory("hosp_fortis_blr", "Fortis Hospital, Cunningham Road"),
  hosp_victoria_blr: generateHospitalInventory("hosp_victoria_blr", "Victoria Hospital (BMCRI)"),
  hosp_kem_mum: generateHospitalInventory("hosp_kem_mum", "King Edward Memorial (KEM) Hospital"),
  hosp_lilavati_mum: generateHospitalInventory("hosp_lilavati_mum", "Lilavati Hospital & Research Centre"),
  hosp_aiims_del: generateHospitalInventory("hosp_aiims_del", "AIIMS New Delhi (Main Blood Bank)"),
  hosp_max_del: generateHospitalInventory("hosp_max_del", "Max Super Speciality Hospital, Saket"),
};

export const INITIAL_REQUESTS: EmergencyRequest[] = [
  {
    id: "req_apollo_emergency_01",
    hospital_id: "hosp_apollo_blr",
    hospital_name: "Apollo Hospital, Bannerghatta",
    hospital_city: "Bengaluru",
    hospital_phone: "+91 80 2630 4050",
    hospital_location: { lat: 12.8931, lng: 77.5979 },
    blood_type: "O-",
    component: "whole_blood",
    units_needed: 4,
    urgency: "critical",
    radius_km: 15,
    status: "open",
    created_at: new Date(Date.now() - 25 * 60000).toISOString(), // 25 mins ago
    matched_donor_count: 2,
    matched_donors: [
      {
        donor_id: "donor_1",
        name: "Rahul Sharma",
        blood_type: "O-",
        phone: "+91 98450 12345",
        distance_km: 1.8,
        response: "confirmed",
        responded_at: new Date(Date.now() - 15 * 60000).toISOString(),
      },
      {
        donor_id: "donor_2",
        name: "Priya Verma",
        blood_type: "O-",
        phone: "+91 98860 67890",
        distance_km: 2.3,
        response: "pending",
        responded_at: null,
      },
    ],
  },
  {
    id: "req_manipal_platelets_02",
    hospital_id: "hosp_manipal_blr",
    hospital_name: "Manipal Hospital, Old Airport Road",
    hospital_city: "Bengaluru",
    hospital_phone: "+91 80 2502 4444",
    hospital_location: { lat: 12.9587, lng: 77.6493 },
    blood_type: "A+",
    component: "platelets",
    units_needed: 2,
    urgency: "high",
    radius_km: 10,
    status: "open",
    created_at: new Date(Date.now() - 75 * 60000).toISOString(),
    matched_donor_count: 1,
    matched_donors: [
      {
        donor_id: "donor_8",
        name: "Deepak Patel",
        blood_type: "A+",
        phone: "+91 98765 43210",
        distance_km: 0.6,
        response: "confirmed",
        responded_at: new Date(Date.now() - 50 * 60000).toISOString(),
      },
    ],
  },
  {
    id: "req_aiims_trauma_03",
    hospital_id: "hosp_aiims_del",
    hospital_name: "AIIMS New Delhi (Main Blood Bank)",
    hospital_city: "New Delhi",
    hospital_phone: "+91 11 2658 8500",
    hospital_location: { lat: 28.5672, lng: 77.2100 },
    blood_type: "B+",
    component: "whole_blood",
    units_needed: 5,
    urgency: "normal",
    radius_km: 20,
    status: "open",
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    matched_donor_count: 1,
    matched_donors: [
      {
        donor_id: "donor_6",
        name: "Ananya Iyer",
        blood_type: "B+",
        phone: "+91 98110 55443",
        distance_km: 2.1,
        response: "pending",
        responded_at: null,
      },
    ],
  },
];

export const INITIAL_CAMPS: Camp[] = [
  {
    id: "camp_redcross_blr",
    ngo_id: "usr_ngo_1",
    ngo_name: "Indian Red Cross Society, Karnataka",
    title: "Bengaluru Mega Youth Blood Drive 2026",
    location: {
      lat: 12.9734,
      lng: 77.6119,
      address: "Rangoli Metro Art Centre, MG Road",
      city: "Bengaluru",
    },
    date: "2026-10-02",
    time: "09:00 AM - 04:00 PM",
    target_blood_types: ["O-", "A-", "B-", "AB-"],
    expected_donors: 250,
    registered_count: 142,
    contact_phone: "+91 80 2226 8435",
  },
  {
    id: "camp_rotary_mum",
    ngo_id: "usr_ngo_2",
    ngo_name: "Rotary Club of Bombay Pier",
    title: "Bandra Coastal Blood Donation Camp",
    location: {
      lat: 19.0600,
      lng: 72.8360,
      address: "Bandra Fort Amphitheatre, Bandra West",
      city: "Mumbai",
    },
    date: "2026-10-10",
    time: "10:00 AM - 05:00 PM",
    target_blood_types: ["O-", "O+", "A+", "B+"],
    expected_donors: 180,
    registered_count: 88,
    contact_phone: "+91 22 2640 1234",
  },
  {
    id: "camp_lions_del",
    ngo_id: "usr_ngo_3",
    ngo_name: "Lions Club International Delhi Central",
    title: "Capital LifeSaver Drive - CP Inner Circle",
    location: {
      lat: 28.6315,
      lng: 77.2167,
      address: "Central Park, Connaught Place",
      city: "New Delhi",
    },
    date: "2026-10-15",
    time: "09:30 AM - 03:30 PM",
    target_blood_types: ["O-", "A-", "AB+"],
    expected_donors: 300,
    registered_count: 215,
    contact_phone: "+91 11 2341 5566",
  },
];
