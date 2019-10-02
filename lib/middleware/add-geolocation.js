const getLocation = require('../services/maps-api');

module.exports = () => (req, res, next) => {  
  const { address } = req.body;

  if(!address) {
    return next({
      statusCode: 400,
      error: 'Address must be supplied', 
    });
  }

  getLocation(address)
    .then(location => {
      if(!location.latitude || !location.longitude) {
        throw {
          statusCode: 400,
          error: 'address must be resolvable by geolocation'
        };
      }
      
      req.body.location = {
        ...location,
        name: address
      };
      next();
    })
    .catch(next);
};

