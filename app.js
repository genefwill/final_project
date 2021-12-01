  // App.js

  /***********************************************************************
      SETUP
  ************************************************************************/
      PORT        = 61574;                // Set a port number at the top so it's easy to change in the future


      /*
          Uses express, dbcon for database connection, body parser to parse form data
          handlebars for HTML templates
      */
      // var path = require('path');
    
      var express = require('express');   // We are using the express library for the web server
      var mysql = require('./database/dbcon.js');
    
      var app     = express();            // We need to instantiate an express object to interact with the server in our code
      app.use(express.json())
      app.use(express.urlencoded({extended: true}))
      
      var handlebars = require('express-handlebars').create({
        defaultLayout: 'main',
        extname: 'hbs'
      });
    
    
      app.engine('hbs', handlebars.engine);
      app.use('/', express.static('public'));
      app.set('view engine', 'hbs');
      app.set('mysql', mysql);
    
    
      app.use('/vets', require('./vets.js'));
      app.use('/owners', require('./owners.js'));
      app.use('/pets', require('./pets.js'));
      app.use('/vets-pets', require('./vetsPets.js'));
      app.use('/appts', require('./appointments.js'));
    
    
    /*  app.get('/owners', function(req, res){
        res.render('owners');
      });*/
    
    
      // app.get('/owners', function(req, res)
      // {  
      //     let query1 = "SELECT * FROM Owners";               // Define our query
    
      //     mysql.pool.query(query1, function(error, rows, fields){    // Execute the query
    
      //         res.render('Owners', {data: rows});                  // Render the index.hbs file, and also send the renderer
      //     })                                                      // an object where 'data' is equal to the 'rows' we
      // });                                                         // received back from the query
    
    
      // app.get('/pets', function(req, res){
      //   res.render('pets');
      // });
    
    
      // app.get('/appts', function(req, res){
      //   res.render('appts');
      // });
    
    
      // app.get('/vets-pets', function(req, res){
      //   res.render('vetsPets');
      // });
    
      app.get('/', function(req, res){
        res.render('homepage');
      });
    
    
    
      // app.use('/', express.static('homepage'));
    
      app.use(function(req,res){
        res.status(404);
        res.render('404');
      });
    
      app.use(function(err, req, res, next){
        console.error(err.stack);
        res.status(500);
        res.render('500');
      });
    
    /*  app.listen(app.get('port'), function(){
        console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
      });*/
      /***********************************************************************
          LISTENER
      ************************************************************************/
    
      app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
          console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
      });