var aws = require('aws-sdk');
aws.config.loadFromPath('credentials.json');

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url; 

if(null == process.env.VCAP_SERVICES) {
	url = 'mongodb://localhost:27017/local';
}
else {
	var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
	url = vcap_services['mongolab'][0].credentials.uri;
}


function PollPendingDonations(){

	console.log('polling ...');

	//pull from queue
	var sqs = new aws.SQS;

	var params = {
     		QueueUrl: 'https://sqs.us-east-1.amazonaws.com/084598340988/NewDonationQueue',
	     	WaitTimeSeconds: 5,
		VisibilityTimeout: 30,
     		MaxNumberOfMessages: 1
    	};	
	
	sqs.receiveMessage(params, function(err, data){
        if(err){
           console.log(err);
        } else {
		console.log('** queue record retrieved from SQS **');
		if(data.Messages) {
          		var results = data.Messages[0]; 
          		console.log(results);
			var msg = JSON.parse(results.Body);
			var receiptHandle = results.ReceiptHandle;

			//add to mongodb
			console.log('** adding record to MongoDB **');
	
			MongoClient.connect(url, function(err, db) {
  				assert.equal(null, err);
	  			console.log("Connected correctly to server");
	
				var collection = db.collection('donations');
				collection.insert(msg, function(err, result) {
    					if(err) {
						console.log(err, err.stack);
						db.close();
					} else {
						console.log('** records added **');
						db.close();

						var deleteparams = {
     							QueueUrl: 'https://sqs.us-east-1.amazonaws.com/084598340988/NewDonationQueue',
	     						ReceiptHandle: receiptHandle
    						};

						console.log('** deleting record from queue **');
						sqs.deleteMessage(deleteparams, function(err, data) {
  							if (err) {
								console.log(err, err.stack);
							} else {
								console.log('message deleted');  
								console.log(data);   
							}        
						});
					}
					//close insert else
				});
				//close insert
			});
			//close db connect
		}
		//close receive data if
     	}
	//close receive msg else
   });

}

setInterval(PollPendingDonations,10000);