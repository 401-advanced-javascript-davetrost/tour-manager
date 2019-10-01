const Tour = require('../tour');

describe('Location model', () => {
  it('generates a model from valid properties', () => {
    const data = {
      title: 'Movement show',
      launchDate: new Date('5/25/2020'),
      activities: ['a-capella singing', 'freestyle frisbee', 'drumming'],
      attendance: 12,
      stops: [
        {
          location: {
            latitude: 45,
            longitude: -122
          },
          weather: {
            high: 78,
            low: 60,
            precipitation: '10%'
          }
        }
      ]
    };

    const tour = new Tour(data);
    const errors = tour.validateSync();
    expect(errors).toBeUndefined();

    const json = tour.toJSON();
    expect(json).toMatchInlineSnapshot(
      {
        _id: expect.any(Object),
        launchDate: expect.any(Date),
        stops: [
          {
            _id: expect.any(Object)
          }
        ]
      },
      `
      Object {
        "_id": Any<Object>,
        "activities": Array [
          "a-capella singing",
          "freestyle frisbee",
          "drumming",
        ],
        "launchDate": Any<Date>,
        "stops": Array [
          Object {
            "_id": Any<Object>,
            "location": Object {
              "latitude": 45,
              "longitude": -122,
            },
            "weather": Object {
              "high": 78,
              "low": 60,
            },
          },
        ],
        "title": "Movement show",
      }
    `
    );
  });

  it('validates required properties', () => {
    const data = {
      activities: [],
      stops: [{}]
    };

    const tour = new Tour(data);
    const { errors } = tour.validateSync();

    expect(errors.title.kind).toBe('required');
    expect(errors['stops.0.location.latitude'].kind).toBe('required');
    expect(errors['stops.0.location.longitude'].kind).toBe('required');
    expect(errors['stops.0.weather.high'].kind).toBe('required');
    expect(errors['stops.0.weather.low'].kind).toBe('required');
  });

  it('populates default properties', () => {
    const data = {
      title: 'Minimal Movement show',
      activities: ['drumming'],
      attendance: 9,
      stops: [
        {
          location: {
            latitude: 45,
            longitude: -122
          },
          weather: {
            high: 78,
            low: 60,
            precipitation: '10%'
          }
        }
      ]
    };

    const tour = new Tour(data);
    const err = tour.validateSync();

    expect(err).toBeUndefined();
    expect(tour.launchDate).toEqual(expect.any(Date));
  });
});
