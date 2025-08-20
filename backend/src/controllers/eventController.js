import Event from "../models/event.js";
import mongoose from "mongoose";

// Create Event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category } = req.body;
    const banner = req.file ? `/uploads/${req.file.filename}` : null;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      banner,
      createdBy: req.user.id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .populate("attendees", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Event
export const getEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("attendees", "name email");

    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (req.file) req.body.banner = `/uploads/${req.file.filename}`;

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register for Event
export const registerEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: "Already registered" });
    }

    event.attendees.push(req.user.id);
    await event.save();

    res.json({ message: "Registered successfully", event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};