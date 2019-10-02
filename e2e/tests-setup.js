const request = require('./request');

function postTour(tour) {
  return request
    .post('/api/tours')
    .send(tour)
    .expect(200)
    .then(({ body }) => body);
}

function postTourStop(id, location) {
  return request
    .post(`/api/tours/${id}/stops`)
    .send(location)
    .expect(200)
    .then(({ body }) => [id, body]);
}

    
module.exports = { postTour, postTourStop };