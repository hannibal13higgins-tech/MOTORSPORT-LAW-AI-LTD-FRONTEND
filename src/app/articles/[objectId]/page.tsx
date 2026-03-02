'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { apiFetch } from "@/lib/api";

interface RegulationObject {
  id: string;
  articleNumber: string;
  clausePath: string;
  title: string;
  text: string;
  tags: string[];
  regulationVersionId: string;
}

export default function ArticlePage() {
  const { objectId } = useParams<{ objectId: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<RegulationObject | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }

      try {
        const data = await apiFetch(
          `/regulation-objects/${objectId}`,
          undefined,
          session.access_token
        ) as RegulationObject | null;

        if (data === null) {
          setNotFound(true);
        } else {
          setArticle(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [objectId, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Loading…</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Not Found</p>
          <p className="text-sm text-gray-500 mt-1">
            This regulation article does not exist.
          </p>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-900 underline mt-4 inline-block"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-red-600">{error}</p>
      </main>
    );
  }

  if (!article) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-gray-900">{article.title}</h1>

            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
              <div>
                <dt className="text-xs text-gray-500">Article Number</dt>
                <dd className="text-sm text-gray-900 font-medium">{article.articleNumber}</dd>
              </div>
              {article.clausePath && (
                <div>
                  <dt className="text-xs text-gray-500">Clause Path</dt>
                  <dd className="text-sm text-gray-900 font-medium">{article.clausePath}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-gray-500">Version</dt>
                <dd className="text-sm text-gray-900 font-medium">{article.regulationVersionId}</dd>
              </div>
            </dl>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mb-5">
              <p className="text-xs text-gray-500 mb-1">Tags</p>
              <div className="flex flex-wrap gap-1">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Full Text
            </p>
            <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
              {article.text}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
