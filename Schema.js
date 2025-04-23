const Joi = require("joi");

const TeacherSchemaJoi = Joi.object({
  fullName: Joi.string().required(),

  country: Joi.string().optional(),

  subjectsTaught: Joi.string().optional(),

  languagesSpoken: Joi.string().optional(),

  phoneNumber: Joi.string()
    .pattern(/^\d+$/)
    .min(10) 
    .max(15) 
    .optional(),

  profilePic: Joi.object({
    url: Joi.string().optional(),
    filename: Joi.string().optional(),
  }).optional(),

  certification: Joi.string().optional(),

  education: Joi.object({
    university: Joi.string().optional(),
    degree: Joi.string().optional(),
    degreeType: Joi.string().optional(),
    specialization: Joi.string().optional(),
  }).optional(),

  availability: Joi.object({
    days: Joi.string().required(),
    time: Joi.string().required(),
  }).required(),

  description: Joi.string().required(),

  pricing: Joi.number().required(),

  experience: Joi.number().optional(), 
});


module.exports = { TeacherSchemaJoi };
