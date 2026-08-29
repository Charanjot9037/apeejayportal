// app/projectDetail/handlers/sections/MentorReviewSection.jsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MessageSquarePlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import DetailCard from '../DetailCard';
import { formatDate } from '../../helpers';

export default function MentorReviewSection({ project, onUpdated }) {
  const [comment, setComment] = useState('');
  const [savingComment, setSavingComment] = useState(false);

  // =========================================================
  // ADD COMMENT
  // =========================================================

  const handleCommentSave = async () => {
    if (!comment.trim()) {
      toast.error('Write a comment before submitting.');
      return;
    }

    try {
      setSavingComment(true);

      const response = await fetch(
        `/api/projects/${project._id}/mentor-review`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit review.');
      }

      toast.success('Review submitted.');

      setComment('');

      onUpdated?.(result.project);
    } catch (error) {
      console.error('MENTOR_COMMENT_SAVE_ERROR:', error);

      toast.error(error.message || 'Failed to submit review.');
    } finally {
      setSavingComment(false);
    }
  };

  // =========================================================
  // DELETE REVIEW
  // =========================================================

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `/api/projects/${project._id}/mentor-review`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reviewId,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete review.');
      }

      toast.success('Review deleted.');

      onUpdated?.(result.project);
    } catch (error) {
      console.error('MENTOR_REVIEW_DELETE_ERROR:', error);

      toast.error(error.message || 'Failed to delete review.');
    }
  };

  // Latest review first
  const history = [...(project.mentorReviews || [])].reverse();

  return (
    <DetailCard title="Mentor Feedback" icon={<MessageSquarePlus />}>
      <div className="space-y-5">
        {/* =====================================================
            ADD FEEDBACK
        ===================================================== */}

        <div className="space-y-3 rounded-xl border border-orange-200 bg-orange-50/50 p-4">
          {/* Feedback Heading */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
              <MessageSquarePlus className="h-4 w-4 text-[rgb(242,121,42)]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">
                Add Feedback for Student
              </p>

              <p className="text-xs text-slate-500">
                Share feedback or suggestions about the project.
              </p>
            </div>
          </div>

          {/* Feedback Textarea */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Write feedback the student will see..."
            className="w-full resize-none rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm transition focus:border-[rgb(242,121,42)] focus:outline-none focus:ring-1 focus:ring-[rgb(242,121,42)]"
          />

          {/* Submit Button */}
          <Button
            type="button"
            onClick={handleCommentSave}
            disabled={savingComment}
            className="w-full gap-2 bg-[rgb(242,121,42)] text-white hover:bg-[#df681c]"
          >
            <MessageSquarePlus className="h-4 w-4" />

            {savingComment ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>

        {/* =====================================================
            REVIEW HISTORY
        ===================================================== */}

        {history.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <p className="text-xs font-semibold text-slate-500">
              Review History
            </p>

            <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
              {history.map((entry, index) => (
                <div
                  key={entry._id || `${entry.reviewedAt}-${index}`}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
                >
                  {/* Date / Status / Delete */}
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{formatDate(entry.reviewedAt)}</span>

                    <div className="flex items-center gap-2">
                      {/* Status shown in history */}
                      {entry.status && (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 font-medium text-slate-600">
                          {entry.status}
                        </span>
                      )}

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(entry._id)}
                        className="text-red-500 transition hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Comment */}
                  {entry.comment && (
                    <p className="mt-1 text-sm text-slate-600">
                      {entry.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DetailCard>
  );
}
