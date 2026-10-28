/*
 * This file only contains the REVIEWS exports (ReviewsTab, ReviewCard).
 * Paste your existing RatingBubble, CrewLine and SeasonsTab components
 * below ReviewCard and merge their imports into the import block below,
 * because TitlePage.jsx imports all of them from this file.
 */

import {useState} from "react";
import {Pencil, Star, Trash2} from "lucide-react";
import {toast} from "sonner"; // use whichever toast library you already use

import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Label} from "@/components/ui/label";
import {Slider} from "@/components/ui/slider";
import {Textarea} from "@/components/ui/textarea";

const DEFAULT_RATING = 8;
const MIN_REVIEW_LENGTH = 3;

const getErrorMessage = (err) =>
    err?.response?.data?.message || err?.message || "Something went wrong";

const formatDate = (value) => {
    if (!value) return "Just now";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

/*
 * =========================
 * Shared form (create + edit)
 * =========================
 */

function ReviewForm({
    rating,
    body,
    onRatingChange,
    onBodyChange,
    onSubmit,
    onCancel,
    submitLabel,
    isSubmitting,
}) {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <Label className="text-sm font-medium">
                Your rating: <span className="text-primary font-bold">{rating}/10</span>
            </Label>

            <Slider
                value={[rating]}
                onValueChange={(v) => onRatingChange(v[0])}
                min={1}
                max={10}
                step={1}
                className="mt-3"
            />

            <Textarea
                value={body}
                onChange={(e) => onBodyChange(e.target.value)}
                placeholder="What did you think?"
                className="mt-4 min-h-24"
            />

            <div className="mt-3 flex justify-end gap-2">
                {onCancel && (
                    <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                )}
                <Button onClick={onSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : submitLabel}
                </Button>
            </div>
        </div>
    );
}

/*
 * =========================
 * Reviews tab
 * =========================
 *
 * reviews  -> ALL reviews of this movie (array)
 * myReview -> the logged-in user's review of this movie, or null
 */

export function ReviewsTab({
    reviews = [],
    myReview = null,
    user,
    onCreateReview,
    onUpdateReview,
    onDeleteReview,
    isCreatingReview,
    isUpdatingReview,
    isDeletingReview,
    isLoading,
    isError,
    error,
    onSignIn,
}) {
    const [editing, setEditing] = useState(false);
    const [rating, setRating] = useState(DEFAULT_RATING);
    const [body, setBody] = useState("");

    const startEditing = () => {
        setRating(myReview.rating);
        setBody(myReview.review ?? "");
        setEditing(true);
    };

    const handleSubmit = async () => {
        const review = body.trim();

        if (review.length < MIN_REVIEW_LENGTH) {
            toast.error("Review is too short");
            return;
        }

        try {
            if (myReview) {
                await onUpdateReview({rating, review});
                setEditing(false);
                toast.success("Review updated");
            } else {
                await onCreateReview({rating, review});
                setBody("");
                setRating(DEFAULT_RATING);
                toast.success("Review posted");
            }
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    const handleDelete = async () => {
        try {
            await onDeleteReview();
            setEditing(false);
            setBody("");
            setRating(DEFAULT_RATING);
            toast.success("Review deleted");
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    if (isLoading) {
        return <div className="text-sm text-muted-foreground">Loading reviews...</div>;
    }

    if (isError) {
        return (
            <div className="text-sm text-destructive">
                Error loading reviews: {error?.message}
            </div>
        );
    }

    /*
     * My review section:
     *  - not signed in      -> sign in button
     *  - no review yet      -> create form
     *  - has review         -> card with edit / delete (or the edit form)
     */

    let mySection;

    if (!user) {
        mySection = (
            <div className="text-sm text-muted-foreground">
                <Button variant="outline" onClick={onSignIn}>
                    Sign in to write a review
                </Button>
            </div>
        );
    } else if (!myReview) {
        mySection = (
            <ReviewForm
                rating={rating}
                body={body}
                onRatingChange={setRating}
                onBodyChange={setBody}
                onSubmit={handleSubmit}
                submitLabel="Post review"
                isSubmitting={isCreatingReview}
            />
        );
    } else if (editing) {
        mySection = (
            <ReviewForm
                rating={rating}
                body={body}
                onRatingChange={setRating}
                onBodyChange={setBody}
                onSubmit={handleSubmit}
                onCancel={() => setEditing(false)}
                submitLabel="Save changes"
                isSubmitting={isUpdatingReview}
            />
        );
    } else {
        mySection = (
            <ReviewCard
                r={myReview}
                onEdit={startEditing}
                onDelete={handleDelete}
                isDeleting={isDeletingReview}
            />
        );
    }

    return (
        <div className="space-y-6">
            {mySection}

            {/* COMMUNITY: always every review of this movie */}

            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                    Community ({reviews.length})
                </h3>

                {reviews.length === 0 && (
                    <p className="text-sm text-muted-foreground">No reviews yet.</p>
                )}

                {reviews.map((r) => (
                    <ReviewCard
                        key={r._id}
                        r={r}
                        isMine={Boolean(myReview) && r._id === myReview._id}
                    />
                ))}
            </div>
        </div>
    );
}

/*
 * =========================
 * Review card
 * =========================
 * Edit / Delete buttons only show when onEdit / onDelete are passed.
 */

export function ReviewCard({r, isMine = false, onEdit, onDelete, isDeleting = false}) {
    const username = r.user?.name || "Anonymous";
    const reviewBody = r.review || "";
    const hasActions = Boolean(onEdit || onDelete);

    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground select-none">
                        {username.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{username}</span>
                            {isMine && <Badge variant="secondary">You</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(r.createdAt)}
                        </div>
                    </div>
                </div>

                <div
                    className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-1 text-sm font-semibold text-primary">
                    <Star className="h-3.5 w-3.5 fill-primary"/> {r.rating}/10
                </div>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {reviewBody}
            </p>

            {hasActions && (
                <div className="mt-3 flex justify-end gap-1">
                    {onEdit && (
                        <Button variant="ghost" size="sm" onClick={onEdit} disabled={isDeleting}>
                            <Pencil className="h-3.5 w-3.5 mr-1"/> Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDelete}
                            disabled={isDeleting}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-1"/>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}