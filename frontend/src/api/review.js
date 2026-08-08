import { request } from "./client";

export const analyzeReview = (review) =>
  request("/api/reviews", { method: "POST", body: JSON.stringify(review) });

export const getUserReviews = () =>
  request("/api/reviews", { method: "GET" });
