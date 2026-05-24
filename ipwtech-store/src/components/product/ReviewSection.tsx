"use client";

import { useEffect, useState } from "react";
import { showError, showSuccess } from "@/src/utils/toast";
import { useAppSelector } from "@/src/store/hooks";
import { useRouter } from "next/navigation";
import { addReview, getProductReviews } from "@/src/services/reviewsService";
import StarRating from "../review/starRating";

export default function ReviewSection({ productId }: { productId: string }) {
    const { token } = useAppSelector((s) => s.auth);
    const router = useRouter();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchReviews = async () => {
        try {
        const res = await getProductReviews(productId);
        setReviews(res);
        } catch {
        showError("Failed to load reviews");
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleSubmit = async () => {
        if (!token) {
        router.push(`/login?redirect=${window.location.pathname}`);
        return;
        }

        if (rating === 0) {
        showError("Please select rating");
        return;
        }

        try {
        setLoading(true);
        await addReview(productId, rating, comment);
        showSuccess("Review submitted");

        setRating(0);
        setComment("");

        fetchReviews();
        } catch {
        showError("Failed to submit review");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="mt-10 flex flex-col gap-6">

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-white">
            Customer Reviews
        </h2>

        {/* ADD REVIEW */}
        <div className="bg-[#0f172a] border border-white/10 rounded-xl p-5 flex flex-col gap-4">

            <StarRating value={rating} onChange={setRating} />

            <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="
                bg-transparent border border-white/10 rounded-lg p-3
                text-sm text-gray-300
                focus:outline-none focus:border-orange-500
            "
            />

            <button
            onClick={handleSubmit}
            disabled={loading}
            className="
                self-start px-5 py-2 rounded-lg bg-orange-500 text-white
                hover:opacity-90 transition
                disabled:opacity-50
            "
            >
            {loading ? "Submitting..." : "Submit Review"}
            </button>
        </div>

        {/* REVIEWS LIST */}
        <div className="flex flex-col gap-4">
            {reviews.length === 0 && (
            <p className="text-gray-400 text-sm">
                No reviews yet.
            </p>
            )}

            {reviews.map((r) => (
            <div
                key={r._id}
                className="bg-[#0f172a] border border-white/10 rounded-xl p-4 flex flex-col gap-2"
            >
                <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium">
                    {r.user?.name || "User"}
                </span>

                <StarRating value={r.rating} />
                </div>

                {r.comment && (
                <p className="text-sm text-gray-300">
                    {r.comment}
                </p>
                )}
            </div>
            ))}
        </div>
        </div>
    );
}