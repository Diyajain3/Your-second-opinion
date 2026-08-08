import emailjs from "@emailjs/browser";
import { request } from "./client";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_7lovx42";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_cftnczy";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "dl0OWI_gm9J7B9b5e";

export const sendFeedback = async (feedback) => {
  let dbResult = null;

  // 1. Save to backend database
  try {
    dbResult = await request("/api/feedback", {
      method: "POST",
      body: JSON.stringify(feedback),
    });
  } catch (backendError) {
    console.warn("Backend feedback save warning:", backendError.message);
  }

  // 2. Send email via EmailJS
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        rating: feedback.rating,
        rating_stars: `${feedback.rating} / 5 Stars`,
        comment: feedback.comment || "No comment provided",
        message: feedback.comment || "No comment provided",
        review_id: feedback.reviewId || "N/A",
        comparison_id: feedback.comparisonId || "N/A",
      },
      PUBLIC_KEY
    );
  } catch (emailError) {
    console.error("EmailJS Error:", emailError);
    if (!dbResult) {
      throw new Error("Failed to send feedback email. Please check EmailJS configuration.");
    }
  }

  return dbResult || { success: true, message: "Feedback sent successfully!" };
};
