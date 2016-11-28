var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cons = require('consolidate'),
	dust = require('dustjs-helpers'),
	dbclient = require('mongodb').MongoClient,
	object_id = require('mongodb').ObjectID,
	assert = require('assert'),
	app = express();
	
// DB Connect 
var url = 'mongodb://<dbuser>:<dbpassword>@ds111718.mlab.com:11718/emily';
dbclient.connect(url,function(err, db){
	assert.equal(null,err);
	// Connection successful
	console.log("Connected to DB server");
	db.close();
})
// Assign Dust Engine To .dust Files
app.engine('dust', cons.dust);

// Set Default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// /GET. Query all file in the table/collection 'courses' -> render and response 
app.get('/', function(req, res){
	dbclient.connect(url, function(err, db){
		assert.equal(null,err);
		db.collection('courses').find().toArray(function(err, list){
			console.log(">> Retrieve Course List \n");
			// Query result is an array of objects
			console.log(list);
			res.render('index', {courses: list});	
		});
		db.close();
		
	})

});

// /POST. This will add course with "Name" - "Desscription" - "Prerequisites"
app.post('/add',function(req, res){
	dbclient.connect(url,function(err,db){
		assert.equal(null,err);

		db.collection('courses').insertOne({
			"name": req.body.name,
			"description": req.body.description,
			"prereq": req.body.prereq
		})
		console.log(">>> Inserted An Entry");

		db.close();
		// Redirect = Refresh to main page
		res.redirect('/');
	})

});

app.delete('/delete/:id', function(req, res){
	// Same as below
	// Connect database -> get collection (the table), then execute mongodb DELETE with the id = name
	
	dbclient.connect(url,function(err,db){
		assert.equal(null, err);


		console.log(">>> Post_ID: " + req.params.id);
		db.collection('courses').deleteOne({_id: new object_id(req.params.id)});
		console.log(">> Deleted Something");
		db.close();
		res.render('./', {});
	})
		

});

// /POST. Update an entry in the table. 
// Will not allow to edit course name. Will need to delete and create a new one for changing Course name.
app.post('/edit', function(req, res){
	dbclient.connect(url,function(err,db){
		assert.equal(null,err);
		db.collection('courses').update(
			// "Name" as ID for UPDATE query
			{name: req.body.name},
			{
				name: req.body.name,
				description: req.body.description, 
				prereq: req.body.prereq
			}, function(err, results){
				// Ignore error. 
				// Done Updating
				console.log("Updated Something");
				db.close();
				// Refresh the main page
				res.redirect('/');
			}
			
		);
	});
});

// Server
app.listen(3001, function(){
	console.log('Server Started On Port 3001');
});
