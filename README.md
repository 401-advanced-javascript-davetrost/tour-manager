# Tour Manager

The server can track travelling tours, including stops. On this tour, the stops are not known until they happen, so
the API needs to be able to add, update and remove stops.

## Basic Routes for 'Tours'
- `/api/tours` has basic CRUD routes.

## Schema details

- The schema structure of a tour looks like this:
  - **title**: required title of the tour
  - **activities**: array of string activities that will happen during the show
  - **launchDate**: date tour will start. defaults to now
  - **stops**: array of stop objects containing the following data
    - **location** : geolocation object
    - **weather** : object with local weather conditions
    - **attendance** : a number (minimum value is 1)

## Detailed routes for 'Stops'

- `POST` `/tours/:id/stops` - adds a stop to this tour. The body of the incoming request is formatted as follows:
    ```json
    {
      "address": "123 Main St"
    }
    ```
- `DELETE` `/tours/:id/stops/:stopId` - remove a stop that got cancelled
- `PUT` `/tours/:id/stops/:stopId/attendance` - update a stop (after complete) with number of attendees

## Geolocation Data and Weather Information

When adding a stop, the API takes an address search, and looks up additional information using Google's geolocation API and the DarkSkies Weather API. This information is inserted into any stop that is created.

## Jest Mocks

On GitHub, Travis will fail any tests that get data from API's based on an API key. Jest Mocks are used to circumvent this issue.