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
      name: RequiredString,
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

tourSchema.statics = {

  addStop(id, stop) {
    return this.updateById(
      id,
      {
        $push: {
          stops: stop
        }
      }
    )
      .then(tour => tour.stops);
  },
  removeStop(id, stopId) {
    return this.updateById(id, {
      $pull: {
        stops: { _id: stopId }
      }
    })
      .then(tour => tour.stops);
  },
  updateAttendance(id, stopId, attendance) {
    return this.updateOne(
      { _id: id, 'stops._id': stopId },
      {
        $set: {
          'stops.$.attendance': attendance
        }
      })
      .then(tour => tour.stops);
  },

};


module.exports = mongoose.model('Tour', tourSchema, 'tours');