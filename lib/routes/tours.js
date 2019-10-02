// eslint-disable-next-line new-cap
const router = require('express').Router();
const Tour = require('../models/tour');

router
  .post('/', (req, res, next) => {
    Tour.create(req.body)
      .then(tour => res.json(tour))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Tour.find()
      .lean()
      .then(tours => res.json(tours))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Tour.findById(req.params.id)
      .lean()
      .then(tours => res.json(tours))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Tour.findByIdAndRemove(req.params.id)
      .then(tour => res.json(tour))
      .catch(next);
  })
  .post('/:id/stops', ({ params, body }, res, next) => {
    Tour.addStop(params.id, body)
      .then(stops => res.json(stops))
      .catch(next);
  })
  .delete('/:id/stops/:stopId', (req, res, next) => {
    Tour.removeStop(req.params.id)
      .then(stops => res.json(stops))
      .catch(next);
  })
  .put('/:id/stops/:stopId/attendance', ({ params, body }, res, next) => {
    Tour.updateAttendance(params.id, params.stopId, body.attendance)
      .then(stops => res.json(stops))
      .catch(next);
  })
;


module.exports = router;