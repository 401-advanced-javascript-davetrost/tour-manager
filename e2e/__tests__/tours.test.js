const request = require('../request');
const db = require('../db');
const { matchMongoId } = require('../match-helpers');
const { postTour } = require('../tests-setup');

describe('api routes for tours', () => {
  beforeEach(() => {
    return db.dropCollection('tours');
  });

  const initialTour = {
    title: 'Movement show',
    activities: ['a-capella singing', 'freestyle frisbee', 'drumming'],
    stops: []
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

  // it('deletes an actor by id', () => {
  //   return postActor(ed).then(actor => {
  //     return request
  //       .delete(`/api/actors/${actor._id}`)
  //       .expect(200)
  //       .then(({ body }) => {
  //         expect(body).toMatchInlineSnapshot(
  //           {
  //             _id: expect.any(String),
  //             dob: expect.any(String)
  //           },
  //           `
  //           Object {
  //             "__v": 0,
  //             "_id": Any<String>,
  //             "dob": Any<String>,
  //             "name": "Edward Norton",
  //             "pob": "Boston, Massachusetts",
  //           }
  //         `
  //         );
  //       });
  //   });
  // });

  // it('does not delete an actor who is currently in a film', () => {
  //   return postFilm(ed, house, fightClub).then(film => {
  //     return request
  //       .delete(`/api/actors/${film.cast[0].actor}`)
  //       .expect(400)
  //       .then(({ body }) => {
  //         expect(body).toMatchInlineSnapshot(`
  //           Object {
  //             "error": "Cannot remove actor",
  //           }
  //         `);
  //       });
  //   });
  // });
});
