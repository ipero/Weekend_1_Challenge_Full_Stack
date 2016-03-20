var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var employees = express.Router();
var pg = require('pg');

var connectString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectString = process.env.DATABASE_URL;
}else{
  connectString = 'postgres://localhost:5432/Employees-Salary';
}

// GET DATA FROM DB
employees.get('/', function(req,res){
  pg.connect(connectString, function(err, client, done){
    if(err){
      done();
      console.log('Error connecting to DB ', err);
      res.status(500).send(err);
    }else{
      var result = [];
      var query = client.query('SELECT * FROM employees;');

      query.on('row', function(row){
        result.push(row);
      });
      query.on('end', function(){
        done();
        res.send(result);
      });
      query.on('error', function(error){
        console.log('Error running query: ', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

// ADD NEW EMPLOYEE TO DB
employees.post('/', function(req, res){
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  var empID = req.body.employeeid;
  var jobTitle = req.body.jobtitle;
  var salary = req.body.salary;

  pg.connect(connectString, function(err, client, done){
    if(err){
      done();
      console.log('Error connecting to DB ', err);
      res.status(500).send(err);
    }else{
      var query = client.query('INSERT INTO employees (first_name, last_name,'+
      'employee_id, job_title, salary) VALUES ($1, $2, $3, $4, $5) ' +
      'RETURNING id, first_name' , [firstName, lastName, empID, jobTitle, salary]);

      query.on('end', function() {
        done();
        res.status(200).send();
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

// UPDATE employee status from true to false or vise versa
employees.put('/', function(req, res){
  var empID = req.body.employee_id;

  pg.connect(connectString, function(err, client, done){
    if(err){
      done();
      console.log('Error connecting to DB ', err);
      res.status(500).send(err);
    }else{

      var query = client.query('UPDATE employees SET status = '+
      'CASE '+
        'WHEN status=true '+
        'THEN false '+
        'ELSE true '+
      'END '+
      'WHERE employee_id = '+empID+';');

      query.on('end', function() {
        done();
        res.status(200).send();
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

module.exports = employees;
