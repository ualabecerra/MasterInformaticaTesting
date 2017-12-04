var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content){
 res.status(status);
 res.json(content);
};

var theEarth = (function() {
  var earthRadius = 6371; // km, miles is 3959

  var getDistanceFromRads = function(rads) {
    return parseFloat(rads * earthRadius);
  };

  var getRadsFromDistance = function(distance) {
    return parseFloat(distance / earthRadius);
  };

  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  };
})();

var buildLocationList = function(results) {
  var locations = [];
  results.forEach(function(doc) {
    locations.push({
      distance: theEarth.getDistanceFromRads(doc.dis),
      name: doc.obj.name,
      address: doc.obj.address,
      rating: doc.obj.rating,
      facilities: doc.obj.facilities,
      _id: doc.obj._id
    });
  });
  return locations;
};

module.exports.locationsListByDistance = function(req, res){
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(2000),
    num: 10
  };
  if (!lng || !lat) {
    console.log('locationsListByDistance missing params');
    sendJsonResponse(res, 404, {
      "message": "lng, lat query parameters are all required"
    });
    return;
  }
  Loc.geoNear(point, geoOptions, function(err, results, stats) {

//    console.log('Geo Results', results);
//    console.log('Geo stats', stats);

    var locations;
    if (err) {
      sendJsonResponse(res, 404, err);
    } else {
      locations = buildLocationList(results);
      sendJsonResponse(res, 200, locations);
    } 
  }); 
};

module.exports.locationsCreate = function(req, res){
 sendJsonResponse(res, 200, {"status" : "success"});
};


module.exports.locationsReadOne = function(req, res){
 if (req.params && req.params.locationid) {
 Loc
 	.findById(req.params.locationid)
 	.exec(function(err, location){
 		if (!location) {
 		 sendJsonResponse(res, 404, {"message" : "locationid not found"});
 		 
 		} else if (err) { sendJsonResponse(res, 404, err);  }
 			else {sendJsonResponse(res, 200, location);}
 	});
 } else { sendJsonResponse(res, 404, {"message" : "No locationid in request"}); } 
};


module.exports.locationsUpdateOne = function(req, res){
 sendJsonResponse(res, 200, {"status" : "success"});
};


module.exports.locationsDeleteOne = function(req, res){
 sendJsonResponse(res, 200, {"status" : "success"});
};



