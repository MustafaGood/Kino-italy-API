const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User.js - Definierar hur en användare ser ut i databasen
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,    // Måste finnas
    unique: true,      // Får inte finnas två användare med samma email
    trim: true,        // Tar bort mellanslag i början och slutet
    lowercase: true    // Gör om till små bokstäver
  },
  password: {
    type: String,
    required: true    // Måste finnas
  },
  name: {
    type: String,
    required: true    // Måste finnas
  },
  role: {
    type: String,
    enum: ['user', 'admin'],  // Kan bara vara 'user' eller 'admin'
    default: 'user'           // Standardvärde är 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now  // Sätts automatiskt när användaren skapas
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 