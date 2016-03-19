var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var employees = require('./routes/employees.js');
var pg = require('pg');

var connectString = '';

if (process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectString = prosess.env.DATABASE_URL;
}else{
  connectString = 'postgres://localhost:5432/Employees-Salary';
}

pg.connect(connectString, function(err, client, done){
  if(err){
    console.log('Error connecting to DB! ', err);
  }else{
    var query = client.query('CREATE TABLE IF NOT EXISTS employees'+
      '(id SERIAL PRIMARY KEY,' +
      'first_name varchar(80) NOT NULL,' +
      'last_name varchar(80) NOT NULL,' +
      'employee_id integer NOT NULL,' +
      'job_title varchar(120),' +
      'salary integer NOT NULL,' +
      'active BOOLEAN DEFAULT true);'
    );
    query.on('end', function(){
      console.log('Successfully ensured schema exists');
      done();
    });
    query.on('error', function(){
      console.log('Error creating schema! ' ,err);
      done();
    });
  }

});

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/employees', employees);

app.get('/*', function(req, res){
  var filename = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '/public/', filename));
});

app.listen(port, function(){
  console.log('Listening for requests on port: ', port);
});
