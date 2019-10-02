const getLocation = require('../services/maps-api');

module.exports = (req, res, next) => {

  console.log('INSIDE ADD GEOLOCATION');
  console.log(req, res, next);

  // const { address } = req.body;
  const address = 'Normandale Park Portland, OR';

  if(!address) {
    return next({
      statusCode: 400,
      error: 'Address must be supplied', 
    });
  }

  getLocation(address)
    .then(location => {
      console.log(location);
      
      if(!location) {
        throw {
          statusCode: 400,
          error: 'address must be resolvable by geolocation'
        };
      }
      
      req.body.location = location;
      next();
    })
    .catch(next);
};

