const request = require('../request');
const db = require('../db');
const { matchMongoId } = require('../match-helpers');
const { postTour, postTourStop } = require('../tests-setup');

describe('api routes for tours', () => {
  beforeEach(() => {
    return db.dropCollection('tours');
  });

  const initialTour = {
    title: 'Movement show',
    activities: ['a-capella singing', 'freestyle frisbee', 'drumming'],
    stops: []
  };

  const location1 = {
    name: 'test location',
    address: 'Normandale Park'
  };
  const attendance1 = {
    attendance: 12
  };

  it('posts a tour without any stops', () => {
    return postTour(initialTour).then(tour => {
      expect(tour).toMatchInlineSnapshot(
        {
          ...matchMongoId,
          launchDate: expect.any(String)
        },
        `
        Object {
          "__v": 0,
          "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
          "activities": Array [
            "a-capella singing",
            "freestyle frisbee",
            "drumming",
          ],
          "launchDate": Any<String>,
          "stops": Array [],
          "title": "Movement show",
        }
      `
      );
    });
  });

  it('gets a tour by id', () => {
    return postTour(initialTour).then(tour => {
      return request
        .get(`/api/tours/${tour._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              ...matchMongoId,
              launchDate: expect.any(String)
            },
            `
            Object {
              "__v": 0,
              "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
              "activities": Array [
                "a-capella singing",
                "freestyle frisbee",
                "drumming",
              ],
              "launchDate": Any<String>,
              "stops": Array [],
              "title": "Movement show",
            }
          `
          );
        });
    });
  });

  it('gets a list of tours', () => {
    return Promise.all([postTour(initialTour), postTour(initialTour)])
      .then(() => {
        return request.get('/api/tours').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(2);
        expect(body[0]).toMatchInlineSnapshot(
          {
            ...matchMongoId,
            launchDate: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
            "activities": Array [
              "a-capella singing",
              "freestyle frisbee",
              "drumming",
            ],
            "launchDate": Any<String>,
            "stops": Array [],
            "title": "Movement show",
          }
        `
        );
      });
  });

  it('deletes a tour by id', () => {
    return postTour(initialTour).then(tour => {
      return request
        .delete(`/api/tours/${tour._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              ...matchMongoId,
              launchDate: expect.any(String)
            },
            `
            Object {
              "__v": 0,
              "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
              "activities": Array [
                "a-capella singing",
                "freestyle frisbee",
                "drumming",
              ],
              "launchDate": Any<String>,
              "stops": Array [],
              "title": "Movement show",
            }
          `
          );
        });
    });
  });

  it('adds a stop to a tour', () => {
    return postTour(initialTour)
      .then(tour => {
        return postTourStop(tour._id, location1);
      })
      .then(([, stops]) => {
        expect(stops[0]).toMatchInlineSnapshot(
          {
            ...matchMongoId
          },
          `
          Object {
            "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
            "location": Object {
              "latitude": 45.5320561,
              "longitude": -122.6061411,
              "name": "Normandale Park",
            },
            "weather": Object {
              "forecast": "Possible drizzle overnight.",
              "high": 63.29,
              "low": 47.07,
              "time": "2019-10-02T07:00:00.000Z",
            },
          }
        `
        );
      });
  });

  it('deletes a stop from a tour', () => {
    return postTour(initialTour)
      .then(tour => {
        return postTourStop(tour._id, location1);
      })
      .then(([id, stops]) => {
        return request
          .delete(`/api/tours/${id}/stops/${stops[0]._id}`)
          .expect(200)
          .then(({ body }) => {
            expect(body[0]).toMatchInlineSnapshot(
              {
                ...matchMongoId
              },
              `
              Object {
                "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
                "location": Object {
                  "latitude": 45.5320561,
                  "longitude": -122.6061411,
                  "name": "Normandale Park",
                },
                "weather": Object {
                  "forecast": "Possible drizzle overnight.",
                  "high": 63.29,
                  "low": 47.07,
                  "time": "2019-10-02T07:00:00.000Z",
                },
              }
            `
            );
          });
      });
  });

  it('updates the attendance for a stop on the tour', () => {
    return postTour(initialTour)
      .then(tour => {
        return postTourStop(tour._id, location1);
      })
      .then(([id, stops]) => {
        return request
          .put(`/api/tours/${id}/stops/${stops[0]._id}/attendance`)
          .send(attendance1)
          .expect(200)
          .then(({ body }) => {
            expect(body[0]).toMatchInlineSnapshot(
              {
                ...matchMongoId
              },
              `
              Object {
                "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
                "attendance": 12,
                "location": Object {
                  "latitude": 45.5320561,
                  "longitude": -122.6061411,
                  "name": "Normandale Park",
                },
                "weather": Object {
                  "forecast": "Possible drizzle overnight.",
                  "high": 63.29,
                  "low": 47.07,
                  "time": "2019-10-02T07:00:00.000Z",
                },
              }
            `
            );
          });
      });
  });
});
