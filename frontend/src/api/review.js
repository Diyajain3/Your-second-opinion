import { request } from "./client";

export const analyzeReview = (review) =>
  request("/api/reviews", { method: "POST", body: JSON.stringify(review) });

export const getUserReviews = (scope = "my") =>
  request(`/api/reviews?scope=${scope}`, { method: "GET" });
