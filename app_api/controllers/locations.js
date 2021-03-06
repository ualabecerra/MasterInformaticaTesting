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
      _id : doc.obj._id,
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
  var lng = parseFloat(req.params.lng);
  var lat = parseFloat(req.params.lat);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(20000),
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

module.exports.locationsCreateOne = function(req, res){
 Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }]
  }, function(err, location) {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 201, location);
    }
  }); 
};

module.exports.locationsReadAll = function(req, res){
 Loc
  .find({})
  .exec(function(err, locations){
    if (!locations) {
     sendJsonResponse(res, 404, {"message" : "locations not found"});
     
    } else if (err) { sendJsonResponse(res, 404, err);  }
      else { 
         sendJsonResponse(res, 200, locations);
        }
  });
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
 if (!req.params.locationid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, locationid is required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec(
      function(err, location) {
        if (!location) {
          sendJsonResponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 400, err);
          return;
        }
        location.name = req.body.name;
        location.address = req.body.address;
        location.facilities = req.body.facilities.split(",");
        location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
        location.openingTimes = [{
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1,
        }, {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2,
        }];
        location.save(function(err, location) {
          if (err) {
            sendJsonResponse(res, 404, err);
          } else {
            sendJsonResponse(res, 200, location);
          }
        });
      }
  );
};


module.exports.locationsDeleteOne = function(req, res){
 if (req.params && req.params.locationid) {
 Loc
 	.findByIdAndRemove(req.params.locationid)
 	.exec(function(err, location){
 		if (!location) {
 		 sendJsonResponse(res, 404, {"message" : "locationid not found"});
 		 
 		} else if (err) { sendJsonResponse(res, 404, err);  }
 		else {sendJsonResponse(res, 200, {"message" : "success"});}
 	});
 } else { sendJsonResponse(res, 404, {"message" : "No locationid in request"}); } 
};

