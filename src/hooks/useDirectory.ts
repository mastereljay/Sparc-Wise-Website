/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import type {
  Organization,
  Service,
  ServiceCategory,
  Location,
  ServiceLocation,
  ServiceWithDetails,
} from '../types';

interface DirectoryState {
  services: ServiceWithDetails[];
  categories: ServiceCategory[];
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
}

export function useDirectory(categoryFilter: string | null, searchQuery: string) {
  const [raw, setRaw] = useState<{
    services: Service[];
    categories: ServiceCategory[];
    organizations: Organization[];
    locations: Location[];
    serviceLocations: ServiceLocation[];
  }>({
    services: [],
    categories: [],
    organizations: [],
    locations: [],
    serviceLocations: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tables once on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setIsLoading(true);
      setError(null);

      try {
        const [servicesRes, categoriesRes, orgsRes, locationsRes, slRes] = await Promise.all([
          supabase.from('services').select('*').eq('is_active', true),
          supabase.from('service_categories').select('*'),
          supabase.from('organizations').select('*').eq('status', 'active'),
          supabase.from('locations').select('*'),
          supabase.from('service_locations').select('*'),
        ]);

        if (servicesRes.error) throw servicesRes.error;
        if (categoriesRes.error) throw categoriesRes.error;
        if (orgsRes.error) throw orgsRes.error;
        if (locationsRes.error) throw locationsRes.error;
        if (slRes.error) throw slRes.error;

        if (!cancelled) {
          setRaw({
            services: servicesRes.data as Service[],
            categories: categoriesRes.data as ServiceCategory[],
            organizations: orgsRes.data as Organization[],
            locations: locationsRes.data as Location[],
            serviceLocations: slRes.data as ServiceLocation[],
          });
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to load directory data');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  // Join + filter
  const result = useMemo<DirectoryState>(() => {
    const orgMap = new Map(raw.organizations.map(o => [o.id, o]));
    const catMap = new Map(raw.categories.map(c => [c.id, c]));
    const locMap = new Map(raw.locations.map(l => [l.id, l]));

    // Build service → locations lookup
    const svcLocMap = new Map<string, Location[]>();
    for (const sl of raw.serviceLocations) {
      const loc = locMap.get(sl.location_id);
      if (loc) {
        const existing = svcLocMap.get(sl.service_id) || [];
        existing.push(loc);
        svcLocMap.set(sl.service_id, existing);
      }
    }

    let enriched: ServiceWithDetails[] = raw.services.map(svc => ({
      ...svc,
      organization: orgMap.get(svc.organization_id) || null,
      category: catMap.get(svc.category_id) || null,
      locations: svcLocMap.get(svc.id) || [],
    }));

    // Filter by category
    if (categoryFilter) {
      enriched = enriched.filter(s => s.category?.id === categoryFilter);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      enriched = enriched.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.description?.toLowerCase().includes(q)) ||
        (s.organization?.name.toLowerCase().includes(q)) ||
        (s.organization?.dba_name?.toLowerCase().includes(q)) ||
        (s.category?.name.toLowerCase().includes(q))
      );
    }

    // Sort by category name, then service name
    enriched.sort((a, b) => {
      const catCmp = (a.category?.name || '').localeCompare(b.category?.name || '');
      if (catCmp !== 0) return catCmp;
      return a.name.localeCompare(b.name);
    });

    return {
      services: enriched,
      categories: raw.categories.sort((a, b) => a.name.localeCompare(b.name)),
      organizations: raw.organizations,
      isLoading,
      error,
    };
  }, [raw, categoryFilter, searchQuery, isLoading, error]);

  return result;
}
