var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cons = require('consolidate'),
	dust = require('dustjs-helpers'),
	pg = require('pg'),
	app = express();

// DB Connect String
var connect = "postgres://user:123456@localhost/coursedb";

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

app.get('/', function(req, res){
	// PG Connect
	pg.connect(connect, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('SELECT * FROM courses', function(err, result) {
	    if(err) {
	      return console.error('error running query', err);
	    }
	    res.render('index', {courses: result.rows});
	    done();
	  });
	});
});

app.post('/add',function(req, res){
	// PG Connect
	pg.connect(connect, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query("INSERT INTO courses(name, description, prereq) VALUES($1, $2, $3)",
	  	[req.body.name, req.body.description, req.body.prereq]);
	
		done();
		res.redirect('/');
	});
});

app.delete('/delete/:id', function(req, res){
	// PG Connect
	pg.connect(connect, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query("DELETE FROM courses WHERE id = $1",
	  	[req.params.id]);
	
		done();
		res.sendStatus(200);
	});
});

app.post('/edit', function(req, res){
	// PG Connect
	pg.connect(connect, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query("UPDATE courses SET name=$1, description=$2, prereq=$3 WHERE id = $4",
	  	[req.body.name, req.body.description, req.body.prereq,req.body.id]);
	
		done();
		res.redirect('/');
	});
});

// Server
app.listen(3000, function(){
	console.log('Server Started On Port 3000');
});