'use client';

import { StatCard } from '@/components/hero/about/StatCard';
import { ABOUT_STATS } from '@/components/hero/about/statsData';

export function AboutStats() {
  return (
    <div className="grid grid-cols-3 gap-6" aria-label="Company statistics">
      {ABOUT_STATS.map((stat) => (
        <StatCard
          key={stat.id}
          icon={stat.icon}
          value={stat.value}
          labelKey={stat.labelKey}
        />
      ))}
    </div>
  );
}
