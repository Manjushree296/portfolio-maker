const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: String,
  aboutMe: String,
  phone: String,
  address: String,
  socials: [String],
  experiences: [
    {
      company: String,
      aboutJob: String,
      from: String,
      to: String
    }
  ],
  education: [
    {
      university: String,
      from: String,
      to: String,
      grade: String
    }
  ],
  skills: {
    technical: [String],
    nonTechnical: [String]
  },
  certifications: [
    {
      name: String,
      link: String
    }
  ],
  achievements: [String],
  hobbies: [String],
  languages: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
