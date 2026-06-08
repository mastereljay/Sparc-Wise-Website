/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Home,
  UtensilsCrossed,
  HeartPulse,
  GraduationCap,
  Hammer,
  Baby,
  Scale,
  Shield,
  TrendingUp,
  TreePine,
  Users,
  MapPin,
  Phone,
  Globe,
  Clock,
  BadgeCheck,
  ExternalLink,
  XCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useDirectory } from '../hooks/useDirectory';
import type { ServiceCategory } from '../types';

// ── Category → Icon + Color mapping ────────────────────────────────

const CATEGORY_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  'Housing':       { icon: Home,             color: 'text-blue-400',    bg: 'bg-blue-400/15' },
  'Food':          { icon: UtensilsCrossed,  color: 'text-amber-400',   bg: 'bg-amber-400/15' },
  'Health':        { icon: HeartPulse,       color: 'text-rose-400',    bg: 'bg-rose-400/15' },
  'Education':     { icon: GraduationCap,    color: 'text-violet-400',  bg: 'bg-violet-400/15' },
  'Workforce':     { icon: Hammer,           color: 'text-orange-400',  bg: 'bg-orange-400/15' },
  'Youth':         { icon: Baby,             color: 'text-pink-400',    bg: 'bg-pink-400/15' },
  'Legal':         { icon: Scale,            color: 'text-cyan-400',    bg: 'bg-cyan-400/15' },
  'Public Safety': { icon: Shield,           color: 'text-emerald-400', bg: 'bg-emerald-400/15' },
  'Economic':      { icon: TrendingUp,       color: 'text-yellow-400',  bg: 'bg-yellow-400/15' },
  'Environment':   { icon: TreePine,         color: 'text-green-400',   bg: 'bg-green-400/15' },
  'Civic':         { icon: Users,            color: 'text-indigo-400',  bg: 'bg-indigo-400/15' },
};

const DEFAULT_META = { icon: BadgeCheck, color: 'text-white/60', bg: 'bg-white/10' };

function getCategoryMeta(name: string) {
  return CATEGORY_META[name] || DEFAULT_META;
}

// ── Skeleton loader ────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/10" />
        <div className="h-4 w-20 rounded-full bg-white/10" />
      </div>
      <div className="h-6 w-3/4 rounded-lg bg-white/10 mb-3" />
      <div className="h-4 w-1/2 rounded-lg bg-white/8 mb-6" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-5/6 rounded bg-white/5" />
      </div>
      <div className="mt-8 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-white/5" />
        <div className="h-6 w-20 rounded-full bg-white/5" />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────

export default function CommunityDirectory() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { services, categories, isLoading, error } = useDirectory(activeCategory, search);

  return (
    <section id="directory" className="py-32 bg-ink text-bg relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-8xl font-serif font-bold mb-6 italic tracking-tighter">
            Community Directory
          </h2>
          <p className="opacity-60 max-w-2xl text-lg">
            Find community services and organizations serving Josephine County. Filter by category or search for what you need.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 opacity-40"
            />
            <input
              id="directory-search"
              type="text"
              placeholder="Search services, organizations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-full py-4 pl-12 pr-12 text-sm placeholder:opacity-40 focus:ring-2 focus:ring-accent/50 outline-none transition-all focus:bg-white/10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
              >
                <XCircle size={18} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 border',
              activeCategory === null
                ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            )}
          >
            All Services
          </button>
          {categories.map(cat => {
            const meta = getCategoryMeta(cat.name);
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(isActive ? null : cat.id)}
                className={cn(
                  'px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 border flex items-center gap-2',
                  isActive
                    ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                )}
              >
                <meta.icon size={14} />
                {cat.name}
              </button>
            );
          })}
        </motion.div>

        {/* Results count */}
        {!isLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-mono uppercase tracking-widest opacity-40 mb-8"
          >
            {services.length} service{services.length !== 1 ? 's' : ''} found
          </motion.p>
        )}

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <XCircle size={48} className="mx-auto mb-4 text-rose-400" />
            <p className="text-lg font-bold mb-2">Something went wrong</p>
            <p className="opacity-60 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Cards grid */}
        {!isLoading && !error && (
          <AnimatePresence mode="popLayout">
            {services.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20"
              >
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-serif italic mb-2">No services found</p>
                <p className="opacity-40 text-sm">Try adjusting your search or filters.</p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {services.map((svc, idx) => {
                  const meta = getCategoryMeta(svc.category?.name || '');
                  const CatIcon = meta.icon;
                  const primaryLocation = svc.locations[0];

                  return (
                    <motion.div
                      key={svc.id}
                      layout
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      className="group bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 flex flex-col relative overflow-hidden hover:border-white/20 hover:bg-white/8 transition-all duration-300"
                    >
                      {/* Hover glow */}
                      <div className="absolute -top-16 -right-16 w-48 h-48 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Category badge + icon */}
                      <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', meta.bg)}>
                          <CatIcon size={20} className={meta.color} />
                        </div>
                        <span className={cn('text-xs font-bold uppercase tracking-[0.15em]', meta.color)}>
                          {svc.category?.name}
                        </span>
                      </div>

                      {/* Service name */}
                      <h3 className="text-xl font-serif font-bold mb-2 leading-tight group-hover:text-accent transition-colors relative z-10">
                        {svc.name}
                      </h3>

                      {/* Organization */}
                      {svc.organization && (
                        <p className="text-sm opacity-50 mb-4 relative z-10">
                          {svc.organization.dba_name || svc.organization.name}
                        </p>
                      )}

                      {/* Description */}
                      {svc.description && (
                        <p className="text-sm opacity-70 leading-relaxed mb-6 flex-grow relative z-10">
                          {svc.description}
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                        {svc.is_free && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-400/15 text-emerald-400 text-xs font-bold uppercase tracking-wide">
                            <BadgeCheck size={12} /> Free
                          </span>
                        )}
                        {svc.intake_process && svc.intake_process !== 'n/a' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-white/60 text-xs font-medium">
                            <Clock size={12} /> {svc.intake_process}
                          </span>
                        )}
                      </div>

                      {/* Footer meta */}
                      <div className="pt-6 border-t border-white/5 space-y-3 relative z-10">
                        {primaryLocation && (
                          <div className="flex items-center gap-2 text-xs opacity-50">
                            <MapPin size={14} className="shrink-0" />
                            <span>{primaryLocation.city}, {primaryLocation.state} {primaryLocation.zip_code}</span>
                          </div>
                        )}
                        {svc.organization?.phone && (
                          <div className="flex items-center gap-2 text-xs opacity-50">
                            <Phone size={14} className="shrink-0" />
                            <a href={`tel:${svc.organization.phone}`} className="hover:text-accent hover:opacity-100 transition-colors">
                              {svc.organization.phone}
                            </a>
                          </div>
                        )}
                        {svc.organization?.website_url && (
                          <div className="flex items-center gap-2 text-xs opacity-50">
                            <Globe size={14} className="shrink-0" />
                            <a
                              href={svc.organization.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-accent hover:opacity-100 transition-colors flex items-center gap-1"
                            >
                              Visit website <ExternalLink size={10} />
                            </a>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
