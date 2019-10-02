const getForecast = require('../services/weather-api');

module.exports = () => (req, res, next) => {  
  const { latitude, longitude } = req.body.location;

  if(!latitude || ! longitude) {
    return next({
      statusCode: 400,
      error: 'Latitude and Longitude must be supplied', 
    });
  }

  getForecast(latitude, longitude)
    .then(forecast => {
      
      if(forecast.length === 0 || !forecast[0].forecast) {
        throw {
          statusCode: 400,
          error: 'Forecast must be returnable from latitude and longitude'
        };
      }
      
      req.body.weather = forecast[0];
      next();
    })
    .catch(next);
};

