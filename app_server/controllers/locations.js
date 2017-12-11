var request = require('request');
var apiOptions = {
   server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production')
    { 
       apiOptions.server = 'https://intense-plains-91368.herokuapp.com/';
    }


var _formatDistance = function (distance) {
  var numDistance, unit;
  
    if (distance > 1000) {
      numDistance = parseFloat(distance).toFixed(1);
      unit = 'km';
    } else {
      numDistance = parseInt(distance);
      unit = 'm';
    }
    return numDistance + unit;
};

var renderHomePage = function(req, res, responseBody){

  var message;
    
  if (!(responseBody instanceof Array)) {
      message = "API lookup error";
      responseBody = [];
  } else {
  if (!responseBody.length) {
    message = "No places found nearby";
  } 
  }

  res.render('locations-list', { 
  title: 'Loc8r - find a place to work with wifi',
  pageHeader: 
    {title: 'Loc8r', strapline: 'Find places to work with wifi near you!' } ,
  sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
  locations: responseBody,
  message : message
    });
};

var renderDetailPage = function(err, res, responseBody){
    res.render('locations-info', { 
        title: 'Location Info',
        pageHeader: {
        title: responseBody.name
        },
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: responseBody
    });
};

var renderReviewFormPage = function(err, res, responseBody){
    res.render('location-review-form', 
        { title: 'Add Review', 
        location : responseBody});    
};


/* GET home page */
module.exports.homelist = function(req, res){
  var requestOption, path;
  var lng = req.query.lng, 
      lat = req.query.lat;

  if (lng && lat)
  {
    path = '/api/locations/' + lng + '/' + lat ;
    requestOption = {
        url : apiOptions.server + path,
        method : 'GET',
        json : {},
        qs :{
         lng : lng,
         lat : lat
        } 
    };
  }
  else {
     path = '/api/locations' ;
    requestOption = {
        url : apiOptions.server + path,
        method : 'GET',
        json : {},
    };

  }

  request(requestOption, function(err,response,body){
    var i, data;

    data = body;
    
    if (response.statusCode === 200 && data.length > 0)
    {
       if (lng && lat) 
        for (i=0; i<data.length; i++) 
         data[i].distance = _formatDistance(data[i].distance);
        
    } 
    renderHomePage(req, res, data);
  });

};

/* GET Location info page */
module.exports.locationInfo = function(req, res){
  
  var requestOption, path;

  path = '/api/locations/' + req.params.locationid;
  requestOption = {
    url : apiOptions.server + path,
    method : 'GET',
    json : {},
  };

  request(requestOption, function(err,response,body){
    
    var data;

    data = body;

     data.coords = {
        lng : body.coords[0],
        lat : body.coords[1]
    }; 

    renderDetailPage(req, res, body);

  });

};

/* GET 'Add review' page */
module.exports.addReview = function(req, res){
  var requestOption, path;

  path = '/api/locations/' + req.params.locationid;
  requestOption = {
    url : apiOptions.server + path,
    method : 'GET',
    json : {},
  };

  request(requestOption, function(err,response,body){
    renderReviewFormPage(req, res, body);

  });
  
};


/* POST 'Add review' page */
module.exports.doAddReview = function(req, res){
  var requestOption, path;
  var postData = {
        author : req.body.name,
        rating : req.body.rating,
        reviewText: req.body.review
    };

  path = '/api/locations/' + req.params.locationid + '/reviews';
  requestOption = {
    url : apiOptions.server + path,
    method : 'POST',
    json : postData
  };

  request(requestOption, function(err,response,body){
    if (response.statusCode === 201) {
      res.redirect('/location/' + req.params.locationid);
    }

  });
  
};