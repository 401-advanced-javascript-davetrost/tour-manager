const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString, RequiredNumber } = require('./required-types');

const tourSchema = new Schema({  
  title: RequiredString,
  activities: [{ type: String }],
  launchDate: {
    type: Date,
    required: true,
    default: () => new Date()
  },
  stops: [{
    location: {
      latitude: RequiredNumber,
      longitude: RequiredNumber
    },
    weather: { 
      high: RequiredNumber,
      low: RequiredNumber,
      description: { type: String },
    },
    attendance: { type: Number, min: 1 },
  }],
});

module.exports = mongoose.model('Tour', tourSchema, 'tours');