/* ==========================================
   REVIEWS & USER FEEDBACK ENGINE
   ========================================== */
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {MessageSquare, Pencil, Star, Trash2} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Slider} from "@/components/ui/slider";
import {Textarea} from "@/components/ui/textarea";
import {useReviewsPerMovie} from "@/hooks/reviews/useReviewsPerMovie.js";
import {useReview} from "@/hooks/reviews/useReview.js";
import {useCreateReview} from "@/hooks/reviews/useCreateReview.js";
import {useUpdateReview} from "@/hooks/reviews/useUpdateReview.js";
import {useDeleteReview} from "@/hooks/reviews/useDeleteReview.js";

/*
 * API review shape:
 * {
 *   _id, tmdbId, rating, review, createdAt, updatedAt,
 *   user: { _id, name, email }
 * }
 */

const DEFAULT_RATING = 8;
const MIN_REVIEW_LENGTH = 3;

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})
        : "";

const getErrorMessage = (error) =>
    error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";

/* ==========================================
   REVIEWS TAB
   ========================================== */
export function ReviewsTab({user, onSignIn, omdbId}) {
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const currentUserId = user?._id ?? user?.id ?? null;

    /* ---------- Queries ---------- */
    const {
        data: reviewsResponse,
        isLoading: isReviewsLoading,
        isError: isReviewsError,
        error: reviewsError,
    } = useReviewsPerMovie(omdbId);

    const {data: myReviewResponse, isLoading: isMyReviewLoading} = useReview(omdbId);

    const allReviews = reviewsResponse?.data?.data ?? [];
    const myReview = myReviewResponse?.data?.data ?? null;

    // Everyone's reviews except the current user's (shown separately above)
    const communityReviews = allReviews.filter(
        (review) => review._id !== myReview?._id && review.user?._id !== currentUserId
    );

    /* ---------- Mutations ---------- */
    const {mutateAsync: addReview, isPending: isCreating} = useCreateReview();
    const {mutateAsync: updateMyReview, isPending: isUpdating} = useUpdateReview();
    const {mutateAsync: removeReview, isPending: isDeleting} = useDeleteReview();

    /* ---------- Handlers ---------- */
    const handleSignIn = () => (onSignIn ? onSignIn() : navigate("/auth"));

    // Throws on failure so the form can display the error
    const handleSave = async (reviewData) => {
        if (myReview) {
            await updateMyReview({tmdbId: omdbId, reviewData});
            setEditing(false);
        } else {
            await addReview({tmdbId: omdbId, reviewData});
        }
    };

    const handleDelete = async () => {
        setDeleteError("");
        try {
            await removeReview(omdbId);
            setEditing(false);
        } catch (error) {
            setDeleteError(getErrorMessage(error));
        }
    };

    /* ---------- Derived UI state ---------- */
    const showForm = Boolean(user) && !isMyReviewLoading && (!myReview || editing);
    const showMyReview = Boolean(user) && Boolean(myReview) && !editing;

    return (
        <div className="space-y-6">
            <section className="space-y-4">
                <h3 className="text-sm font-semibold">Your Review</h3>

                {!user && (
                    <div className="rounded-lg border border-border bg-card p-5 text-center">
                        <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted-foreground"/>
                        <p className="text-sm text-muted-foreground">
                            Sign in to share your thoughts about this movie.
                        </p>
                        <Button variant="outline" className="mt-3" onClick={handleSignIn}>
                            Sign in to write a review
                        </Button>
                    </div>
                )}

                {user && isMyReviewLoading && <div className="h-32 animate-pulse rounded-lg bg-muted"/>}

                {showForm && (
                    <ReviewForm
                        initialRating={myReview?.rating}
                        initialReview={myReview?.review}
                        isEditing={editing}
                        isSubmitting={isCreating || isUpdating}
                        onSubmit={handleSave}
                        onCancel={() => setEditing(false)}
                    />
                )}

                {showMyReview && (
                    <>
                        <ReviewCard
                            review={myReview}
                            isOwn
                            isDeleting={isDeleting}
                            onEdit={() => setEditing(true)}
                            onDelete={handleDelete}
                        />
                        {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
                    </>
                )}
            </section>

            <section className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                    Community{!isReviewsLoading && !isReviewsError && ` (${communityReviews.length})`}
                </h3>

                {isReviewsLoading && (
                    <div className="space-y-3">
                        <div className="h-28 animate-pulse rounded-lg bg-muted"/>
                        <div className="h-28 animate-pulse rounded-lg bg-muted"/>
                    </div>
                )}

                {isReviewsError && (
                    <div className="rounded-lg border border-dashed border-destructive/50 p-6 text-center">
                        <p className="text-sm text-destructive">
                            {getErrorMessage(reviewsError)}
                        </p>
                    </div>
                )}

                {!isReviewsLoading && !isReviewsError && communityReviews.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center">
                        <p className="text-sm text-muted-foreground">No community reviews yet.</p>
                    </div>
                )}

                {communityReviews.map((review) => (
                    <ReviewCard key={review._id} review={review}/>
                ))}
            </section>
        </div>
    );
}

/* ==========================================
   REVIEW FORM (create + edit)
   Local state is seeded from props on mount, so there's
   nothing to sync or reset when switching modes.
   ========================================== */
function ReviewForm({initialRating, initialReview, isEditing, isSubmitting, onSubmit, onCancel}) {
    const [rating, setRating] = useState(initialRating ?? DEFAULT_RATING);
    const [body, setBody] = useState(initialReview ?? "");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmed = body.trim();
        if (trimmed.length < MIN_REVIEW_LENGTH) {
            setError(`Your review must contain at least ${MIN_REVIEW_LENGTH} characters.`);
            return;
        }

        setError("");
        try {
            await onSubmit({rating, review: trimmed});
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-4">
            <div className="space-y-3">
                <Label>
                    Your rating: <span className="font-bold text-primary">{rating}/10</span>
                </Label>
                <Slider
                    value={[rating]}
                    onValueChange={(value) => setRating(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    disabled={isSubmitting}
                />
            </div>

            <Textarea
                value={body}
                onChange={(event) => {
                    setBody(event.target.value);
                    setError("");
                }}
                placeholder="What did you think about this movie?"
                className="min-h-24"
                disabled={isSubmitting}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-2">
                {isEditing && (
                    <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? isEditing ? "Saving..." : "Posting..."
                        : isEditing ? "Save changes" : "Post review"}
                </Button>
            </div>
        </form>
    );
}

/* ==========================================
   REVIEW CARD
   ========================================== */
export function ReviewCard({review, isOwn = false, isDeleting = false, onEdit, onDelete}) {
    const author = review.user?.name || "Anonymous";

    return (
        <article className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {author.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{author}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                    </div>
                </div>
                <div
                    className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary/15 px-2 py-1 text-sm font-semibold text-primary">
                    <Star className="h-3.5 w-3.5 fill-primary"/>
                    {review.rating}/10
                </div>
            </div>

            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
                {review.review}
            </p>

            {isOwn && (
                <div className="mt-3 flex justify-end gap-1">
                    <Button type="button" variant="ghost" size="sm" onClick={onEdit} disabled={isDeleting}>
                        <Pencil className="mr-1 h-3.5 w-3.5"/> Edit
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="mr-1 h-3.5 w-3.5"/> {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            )}
        </article>
    );
}