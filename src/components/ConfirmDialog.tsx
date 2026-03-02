'use client';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  loading = false,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-sm shadow-lg">
        <p className="text-sm text-gray-800 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-sm px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="text-sm px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
