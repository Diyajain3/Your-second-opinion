import express from "express";
import prisma from "../db/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router=express.Router();

//POST /api/feedback

router.post("/",requireAuth,async(req,res)=>
{
  const {reviewId, comparisonId,rating,comment}=req.body;

  if(!reviewId && !comparisonId)
  {
    return res.status(400).json({error:"Must provide reviewId or comparisonId"})
  }

  try{
    const feedback=await prisma.feedback.create({
      data:{
        userId:req.userId,
        reviewId:reviewId||null,
        comparisonId:comparisonId||null,
        rating,
        comment
      }
    });
    res.status(201).json(feedback);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({error:"failed to save feedback"});
  }
});

export default router;