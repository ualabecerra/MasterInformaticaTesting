var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content){
 res.status(status);
 res.json(content);
};


var updateAverageRating = function(locationid){
	Loc.findById(locationid).select("rating reviews").exec(function(err,location){
		if (!err) { doSetAverageLocation(location);}
	});
};

var doSetAverageLocation = function(location){
	var i, reviewCount, ratingAverage, ratingTotal;
  	
  	if (location.reviews && location.reviews.length > 0) {
  		  reviewCount = location.reviews.length;
    	  ratingTotal = 0;
    	  for (i = 0; i < reviewCount; i++) {
      		ratingTotal = ratingTotal + location.reviews[i].rating;
    	  }
    	  ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    	  location.rating = ratingAverage;
    	  location.save(function(err) {
      	  if (err) {
        	console.log(err);
      	  } else {
        	console.log("Average rating updated to", ratingAverage);
      	  }
    	 });
    }
};

var doAddReview = function(req, res, location){
	if (!location) { sendJsonResponse(res, 404, {"message" : "Location rnot found"});  }
	else {
			location.reviews.push({
				author : req.body.author,
				rating : req.body.rating,
				reviewText : req.body.reviewText
			});
			location.save(function(err,location){
				var thisReview;
				if (err) { sendJsonResponse(res, 404, err);  }
				else { 
					updateAverageRating(location._id);
					thisReview = location.reviews[location.reviews.length-1];
					sendJsonResponse(res,201,thisReview);
			      }
			  });
		} 
};


module.exports.reviewsCreateOne = function(req, res){
  var locationid = req.params.locationid;

  if (locationid) {
  	Loc.findById(locationid).select("reviews").exec(function(err, location){
  		if (err){ sendJsonResponse(res, 400, err); }
  		else { doAddReview(req, res, location); }	 
  	});
  } else { sendJsonResponse(res, 404, {"message" : "Not found location required"}); }
};


module.exports.reviewsReadOne = function(req, res){
  if (req.params && req.params.locationid && req.params.reviewid) {
 Loc
 	.findById(req.params.locationid)
 	.select('name reviews')
 	.exec(function(err, location){
 		var respomse, review;

 		if (!location) {
 		 sendJsonResponse(res, 404, {"message" : "locationid not found"});
 		 return ;
 		} else if (err) { sendJsonResponse(res, 404, err); return; }
 		if (location.reviews && location.reviews.length > 0) {
        	review = location.reviews.id(req.params.reviewid);
 			if (!review) {
 					sendJsonResponse(res, 404, {"message" : "reviewid not found"});
 					return;
 				} else {
 					reponse = {location : {name : location.name,
 										  _id : req.params.locationid},
 						       review : review
 							  };
 					sendJsonResponse(res, 200, reponse);
 					return;
 				} 
 			} else {sendJsonResponse(res, 404, {"message" : "No reviews found"});  }
 	});
 } else { sendJsonResponse(res, 404, {"message" : "No locationid nor reviewid in request"}); } 
};

module.exports.reviewsUpdateOne = function(req, res){
  sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.reviewsDeleteOne = function(req, res){
  sendJsonResponse(res, 200, {"status" : "success"});
};

