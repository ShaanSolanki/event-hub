import express from "express";
import upload from "../utils/upload.js";
import authMiddleware from "../middleware/authmiddleware.js";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// ✅ Public routes
router.get("/get", getEvents);
router.get("/getbyid/:id", getEvent);

// ✅ Protected routes (only logged-in users)
router.post("/create", authMiddleware, upload.single("banner"), createEvent);

// ✅ Update & Delete — only creator can do it (handled in controller)
router.put("/update/:id", authMiddleware, upload.single("banner"), updateEvent);
router.delete("/delete/:id", authMiddleware, deleteEvent);

// ✅ Register (any authenticated user can join event)
router.post("/register/:id", authMiddleware, registerEvent);

export default router;
