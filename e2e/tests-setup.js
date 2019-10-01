const request = require('./request');

function postTour(tour) {
  return request
    .post('/api/tours')
    .send(tour)
    .expect(200)
    .then(({ body }) => body);
}

function postTourDate(tour, date) {
  return request
    .post('/api/tours/:id/date')
    .send(tour)
    .send(date)
    .expect(200)
    .then(({ body }) => body);
}

    
module.exports = { postTour, postTourDate };