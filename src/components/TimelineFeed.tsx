'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { apiFetch } from "@/lib/api";

interface Event {
  id: string;
  type: string;
  createdAt: string;
  payload?: Record<string, unknown>;
}

interface EventsResponse {
  events: Event[];
  nextCursor: string | null;
}

export default function TimelineFeed({ orgId }: { orgId: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchEvents(nextCursor?: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const path = nextCursor
      ? `/orgs/${orgId}/events?cursor=${encodeURIComponent(nextCursor)}`
      : `/orgs/${orgId}/events`;

    const data = await apiFetch(path, undefined, session.access_token) as EventsResponse | null;
    return data;
  }

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        if (data) {
          setEvents(data.events ?? []);
          setCursor(data.nextCursor ?? null);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load events"))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  async function handleLoadMore() {
    if (!cursor) return;
    setLoadingMore(true);
    try {
      const data = await fetchEvents(cursor);
      if (data) {
        setEvents((prev) => [...prev, ...(data.events ?? [])]);
        setCursor(data.nextCursor ?? null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-400">Loading activity…</p>;
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Activity
      </p>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {events.length === 0 && !error && (
        <p className="text-sm text-gray-400">No activity yet.</p>
      )}

      <ul className="space-y-2">
        {events.map((event) => (
          <li
            key={event.id}
            className="bg-white border border-gray-200 rounded px-4 py-3 text-sm"
          >
            <span className="font-medium text-gray-700">{event.type}</span>
            <span className="text-gray-400 ml-2 text-xs">
              {new Date(event.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>

      {cursor && (
        <button
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="mt-4 text-sm text-gray-600 underline hover:text-gray-900 disabled:opacity-50"
        >
          {loadingMore ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
