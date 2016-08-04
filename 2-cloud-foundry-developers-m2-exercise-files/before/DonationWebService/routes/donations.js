
var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url; 

if(null == process.env.VCAP_SERVICES) {
	url = 'mongodb://localhost:27017/local';
}
else {
	var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
	url = vcap_services['mongolab'][0].credentials.uri;
}

/* GET donation listing. */
router.get('/:donorid/donations.json', function(req, res) {
  
	var donorid = parseInt(req.params.donorid);
	console.log(donorid);

	//get from mongodb
	console.log('** getting record from MongoDB **');
	
	var docResult;
	
	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		console.log("Connected correctly to server");

		var collection = db.collection('donations');
		
		var query = {};
		var name = 'donorid';
		query[name] = donorid;
		console.log(JSON.stringify(query));

		// Locate documents by key
        	collection.find(query).toArray(function(err, docs) {    
			if(err) {
				console.log(err, err.stack);  
				db.close();
			} else {      
          			console.log('Returned documents');
				console.log(docs);
				var docResult = JSON.stringify(docs);
				console.log(docResult);
				db.close();

				res.send(docResult);
			}
        	});
		//close find
	});
	//close connect
});

/* POST new donation. */
router.post('/donations.json', function(req, res) {

	var donation = {donorid: req.body.donorid, donorname: req.body.donorname, donationamount: req.body.donationamount};

    	//add to MongoDB
	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		console.log("Connected correctly to server");

		var collection = db.collection('donations');

		collection.insert(donation, function(err, result) {
			if(err) {
				console.log(err, err.stack);  
				db.close();
			} else {      
          			console.log('inserted document');

				db.close();

				//res.header('Location' , donation.donorid + '/donations.json' );
				res.status(201).end();
			}

		});
		//close insert
	});
	//close connect
});


module.exports = router;
