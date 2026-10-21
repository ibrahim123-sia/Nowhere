import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiCheck } from "react-icons/fi";
import { toast } from "sonner";
import Rating from "../Common/Rating";
import { fetchReviews, submitReview } from "../../redux/slices/productSlice";

const FIT_OPTIONS = ["Runs Small", "True to Size", "Runs Large"];

const ReviewForm = ({ product, onDone }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ rating: 0, title: "", comment: "", fit: "True to Size", sizePurchased: "" });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.rating) return toast.error("Please choose a star rating");
    setSaving(true);
    try {
      await dispatch(submitReview({ id: product._id, review: form })).unwrap();
      toast.success("Thanks for your review!");
      dispatch(fetchReviews({ id: product._id }));
      onDone();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-5">
      <div>
        <span className="label">Your rating</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setForm({ ...form, rating: n })}
              className={`text-2xl transition ${n <= form.rating ? "text-amber-500" : "text-stone-300 hover:text-amber-300"}`}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="review-fit">How did it fit?</label>
          <select id="review-fit" className="input" value={form.fit} onChange={(e) => setForm({ ...form, fit: e.target.value })}>
            {FIT_OPTIONS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="review-size">Size bought</label>
          <select id="review-size" className="input" value={form.sizePurchased} onChange={(e) => setForm({ ...form, sizePurchased: e.target.value })}>
            <option value="">Select</option>
            {product.sizes.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="review-title">Title</label>
        <input id="review-title" className="input" maxLength={100} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sum it up" />
      </div>
      <div>
        <label className="label" htmlFor="review-comment">Review</label>
        <textarea id="review-comment" className="input min-h-[110px]" maxLength={1000} required minLength={10} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="What did you like? How was the quality and fit?" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? "Posting..." : "Post review"}</button>
        <button type="button" onClick={onDone} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
};

const ProductReviews = ({ product }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { reviews: data, reviewsLoading } = useSelector((state) => state.products);
  const [sort, setSort] = useState("newest");
  const [writing, setWriting] = useState(false);

  useEffect(() => {
    dispatch(fetchReviews({ id: product._id, sort }));
  }, [dispatch, product._id, sort]);

  const summary = data.productId === product._id ? data.summary : null;
  const reviews = data.productId === product._id ? data.reviews : [];
  const fitTotal = summary ? Object.values(summary.fit).reduce((a, b) => a + b, 0) : 0;
  const fitScore = fitTotal
    ? ((summary.fit["Runs Large"] - summary.fit["Runs Small"]) / fitTotal) * 50 + 50
    : 50;

  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Reviews</p>
          <h2 className="heading-display mt-1 text-3xl">What customers say</h2>
        </div>
        {user ? (
          !writing && <button onClick={() => setWriting(true)} className="btn-outline">Write a review</button>
        ) : (
          <Link to={`/login?redirect=${encodeURIComponent(location.pathname)}`} className="btn-outline">Sign in to review</Link>
        )}
      </div>

      {summary && summary.count > 0 && (
        <div className="mt-8 grid gap-8 rounded-3xl bg-cream p-6 md:grid-cols-3">
          <div>
            <p className="font-display text-5xl font-medium">{summary.average.toFixed(1)}</p>
            <Rating value={summary.average} className="mt-2" />
            <p className="mt-1 text-sm text-ink-muted">Based on {summary.count} reviews</p>
          </div>
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary.distribution[star] || 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-3 text-ink-soft">{star}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-300/60">
                    <div className="h-full rounded-full bg-ink" style={{ width: `${(count / summary.count) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right text-ink-muted">{count}</span>
                </div>
              );
            })}
          </div>
          {fitTotal > 0 && (
            <div>
              <p className="text-sm font-semibold">Fit</p>
              <div className="relative mt-4 h-1.5 rounded-full bg-stone-300/60">
                <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink shadow" style={{ left: `${fitScore}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-ink-muted">
                <span>Runs small</span>
                <span>True to size</span>
                <span>Runs large</span>
              </div>
              <p className="mt-3 text-xs text-ink-soft">
                {Math.round((summary.fit["True to Size"] / fitTotal) * 100)}% say it fits true to size
              </p>
            </div>
          )}
        </div>
      )}

      {writing && <div className="mt-6"><ReviewForm product={product} onDone={() => setWriting(false)} /></div>}

      {reviews.length > 0 ? (
        <>
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-ink-muted">{data.total} reviews</p>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-medium" aria-label="Sort reviews">
              <option value="newest">Newest</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>
          <ul className="mt-4 divide-y divide-stone-200">
            {reviews.map((review) => (
              <li key={review._id} className="grid gap-3 py-6 md:grid-cols-[200px_1fr]">
                <div className="text-sm">
                  <p className="font-semibold">{review.name}</p>
                  {review.verifiedPurchase && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-success"><FiCheck /> Verified buyer</p>
                  )}
                  {review.sizePurchased && <p className="mt-1 text-xs text-ink-muted">Bought size {review.sizePurchased}</p>}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Rating value={review.rating} size="h-3.5 w-3.5" />
                    <span className="text-xs text-ink-muted">{new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                    {review.fit && <span className="badge bg-stone-100 text-ink-soft">{review.fit}</span>}
                  </div>
                  {review.title && <p className="mt-2 font-semibold">{review.title}</p>}
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{review.comment}</p>
                </div>
              </li>
            ))}
          </ul>
          {data.page < data.pages && (
            <button
              onClick={() => dispatch(fetchReviews({ id: product._id, sort, page: data.page + 1 }))}
              disabled={reviewsLoading}
              className="btn-outline mt-2"
            >
              {reviewsLoading ? "Loading..." : "Show more reviews"}
            </button>
          )}
        </>
      ) : (
        !reviewsLoading && !writing && <p className="mt-6 text-sm text-ink-muted">No reviews yet. Be the first to share your thoughts.</p>
      )}
    </section>
  );
};

export default ProductReviews;
