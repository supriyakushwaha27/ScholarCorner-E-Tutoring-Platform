const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png",
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 2,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique reviews by a user for a specific teacher
ReviewSchema.index({ userId: 1, teacherId: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
