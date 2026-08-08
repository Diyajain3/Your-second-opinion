import express from "express";
import prisma from "../db/prisma.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router=express.Router();

function isValidEmail(email) {
  return email.includes("@") && email.includes(".");
}
//POST /api/auth/signup
router.post("/signup",async(req,res)=>
{
  const {email,password,name}=req.body;

  if(!email || !password)
  {
    return res.status(400).json({error:"Email and passowrd are required"});
  }
   if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }
  try{
    const existingUser=await prisma.user.findUnique({where:{email}})
    if(existingUser)
    {
      return res.status(409).json({error:"Email already registered"})
    }
    const passwordHash=await bcrypt.hash(password,10);
    const user=await prisma.user.create({
      data:{email,passwordHash,name}
    });
    const secret = process.env.JWT_SECRET || "default_jwt_secret";
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });

    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
  });


//POST /api/auth/login
  router.post("/login",async(req,res)=>
{
  const {email,password}=req.body;

  if(!email || !password)
  {
    return res.status(400).json({error:"Email and password are required"});
  }
   if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }
  try{
    const user=await prisma.user.findUnique({where:{email}})
    if(!user)
    {
      return res.status(401).json({error:"Invalid email or password"})
    }
    const validPassword=await bcrypt.compare(password,user.passwordHash);

    if(!validPassword)
    {
           return res.status(401).json({error:"Invalid email or password"})
    }
   
    const secret = process.env.JWT_SECRET || "default_jwt_secret";
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });

    res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please check your credentials or database connection." });
  }
  });

  export default router;

