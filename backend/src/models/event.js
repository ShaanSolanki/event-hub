import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      trim: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    time: { 
      type: String, 
      trim: true 
    },
    location: { 
      type: String, 
      trim: true 
    },
    category: { 
      type: String, 
      trim: true 
    },
    banner: { 
      type: String // store file path or URL of uploaded image
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", // ✅ reference to User model
      required: true 
    },
    attendees: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
