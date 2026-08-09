import { request } from "./client";

export const compareProducts = (products) =>
  request("/api/comparisons", {
    method: "POST",
    body: JSON.stringify(products),
  });

export const getUserComparisons = (scope = "my") =>
  request(`/api/comparisons?scope=${scope}`, { method: "GET" });
