const mongoose = require("mongoose");
const { Schema } = mongoose;

const TeacherSchema = new Schema({
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  experience:{
    type:Number
  },
  fullName: {
    type: String,
    required: true,
  },
  country: String,
  subjectsTaught: [String],
  languagesSpoken: [String],
  phoneNumber: {
    type: Number,
  },
  profilePic: {
    url: String,
    filename:String
  },
  certification: String,
  education: {
    university: String,
    degree: String,
    degreeType: String,
    specialization: String,
  },
  availability: {
    days: String,
    time: String,
  },
  description: {
    type: String,
    required: true,
  },
  pricing: {
    type: Number,
    required: true,
  },
});

const Teacher = mongoose.model("Teacher", TeacherSchema);

module.exports = Teacher;
