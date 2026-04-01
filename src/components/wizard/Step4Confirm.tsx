"use client";

export function Step4Confirm({
  data,
  onSubmit,
  onBack,
}: {
  data: any;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gray-50 p-6">
        <h3 className="font-semibold text-ink-900">Device Information</h3>
        <dl className="mt-4 space-y-2">
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Type:</dt>
            <dd className="font-medium">{data.device_type}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Brand:</dt>
            <dd className="font-medium">{data.brand}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Model:</dt>
            <dd className="font-medium">{data.model}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg bg-gray-50 p-6">
        <h3 className="font-semibold text-ink-900">Issue</h3>
        <p className="mt-2 text-sm text-gray-700">{data.issue_description}</p>
      </div>

      <div className="rounded-lg bg-gray-50 p-6">
        <h3 className="font-semibold text-ink-900">Location</h3>
        <dl className="mt-4 space-y-2">
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Address:</dt>
            <dd className="font-medium">{data.address}</dd>
          </div>
        </dl>
      </div>

      {data.photoUrls && data.photoUrls.length > 0 && (
        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="font-semibold text-ink-900">Photos ({data.photoUrls.length})</h3>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Submit Repair Request
        </button>
      </div>
    </div>
  );
}
