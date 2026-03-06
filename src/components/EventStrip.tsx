'use client';

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

interface OrgEvent {
  id: string;
  type: string;
  createdAt: string;
  payload?: Record<string, unknown>;
}

interface EventsResponse {
  events: OrgEvent[];
}

export default function EventStrip({ orgId }: { orgId: string }) {
  const [events, setEvents] = useState<OrgEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/orgs/${orgId}/events`)
      .then((data) => {
        const res = data as EventsResponse | null;
        setEvents(res?.events?.slice(0, 5) ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orgId]);

  if (loading) {
    return <p className="text-xs text-[#6b7280]">Loading audit trail&hellip;</p>;
  }

  if (events.length === 0) {
    return <p className="text-xs text-[#6b7280]">No audit events yet.</p>;
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-2">
        Audit Trail
      </p>
      <ul className="space-y-1">
        {events.map((event) => (
          <li key={event.id} className="text-xs text-[#6b7280] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00a3ff] shrink-0" />
            <span className="font-medium text-[#e5e7eb]">{event.type}</span>
            <span>{new Date(event.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
