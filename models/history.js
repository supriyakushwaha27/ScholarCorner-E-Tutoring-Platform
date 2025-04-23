const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  teacherName: { type: String, required: true }, // Store teacher's name
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  meetingCode: { type: String },
  status: { type: String, enum: ['completed', 'canceled'], required: true },
  updatedAt: { type: Date, default: Date.now },
});

const History = mongoose.model('History', HistorySchema);
module.exports = History;
