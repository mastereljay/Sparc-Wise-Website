/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ── Supabase row types ──────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  dba_name: string | null;
  ein: string | null;
  org_type: 'nonprofit' | 'government' | 'foundation' | string;
  status: 'active' | 'inactive' | string;
  mission: string | null;
  website_url: string | null;
  phone: string | null;
  email: string | null;
  primary_location_id: string | null;
  annual_budget_usd: number | null;
  staff_count_ft: number | null;
  staff_count_pt: number | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  organization_id: string;
  category_id: string;
  name: string;
  description: string | null;
  eligibility_notes: string | null;
  hours_of_operation: string | null;
  is_free: boolean;
  intake_process: string | null;
  capacity: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Location {
  id: string;
  address_line1: string | null;
  address_line2: string | null;
  city: string;
  state: string;
  zip_code: string;
  county: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

export interface ServiceLocation {
  id: string;
  service_id: string;
  location_id: string;
}

// ── Joined / enriched types ─────────────────────────────────────────

export interface ServiceWithDetails extends Service {
  organization: Organization | null;
  category: ServiceCategory | null;
  locations: Location[];
}
