'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ClipboardCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import DetailCard from '../DetailCard';

const STATUS_OPTIONS = [
  'Pending Approval',
  'Approved',
  'Rejected',
  'In Review',
];

export default function ProjectStatusSection({ project, onUpdated }) {
  const [status, setStatus] = useState(project.status || 'Pending Approval');

  const [savingStatus, setSavingStatus] = useState(false);

  const handleStatusSave = async () => {
    try {
      setSavingStatus(true);

      const response = await fetch(
        `/api/projects/${project._id}/mentor-review`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update status.');
      }

      toast.success('Status updated.');

      onUpdated?.(result.project);
    } catch (error) {
      console.error('MENTOR_STATUS_SAVE_ERROR:', error);

      toast.error(error.message || 'Failed to update status.');
    } finally {
      setSavingStatus(false);
    }
  };

  return (
    <DetailCard title="Project Status" icon={<ClipboardCheck />}>
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-500">
          Project Status
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 focus:border-[rgb(242,121,42)] focus:outline-none"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <Button
          type="button"
          onClick={handleStatusSave}
          disabled={savingStatus || status === project.status}
          className="bg-[rgb(242,121,42)] text-white hover:bg-[#df681c]"
        >
          {savingStatus ? 'Saving...' : 'Update Status'}
        </Button>
      </div>
    </DetailCard>
  );
}
