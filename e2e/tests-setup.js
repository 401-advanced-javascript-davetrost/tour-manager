const request = require('./request');

function postTour(tour) {
  return request
    .post('/api/tours')
    .send(tour)
    .expect(200)
    .then(({ body }) => body);
}

function postTourStop(id, stop) {
  return request
    .post(`/api/tours/${id}/stops`)
    .send(stop)
    .expect(200)
    .then(({ body }) => [id, body]);
}

    
module.exports = { postTour, postTourStop };