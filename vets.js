module.exports = function(){
	var express = require('express');
	var router = express.Router();
	var db = require('./database/dbcon');

	function getOwners(res, mysql, context, complete){
		let query1 = `SELECT vetID, name, email FROM Veterinarians;`;
		
		mysql.pool.query(query1, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}

			context.vets = results;
			complete();
		})
	}

	// Display all Vets. 
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteVets.js"];

		var mysql = req.app.get('mysql');
		getOwners(res, mysql, context, complete);

		function complete(){
			callbackCount++;

			if(callbackCount >= 1){
				res.render('vets', context);
			}
		}
	})


	// Add a new Vet row
    // Add a record, redirects to the default page for this entity after adding
    // This route is reached when the user adds a new record from the default page through ./views/employees.hbs
    router.post('/', function(req, res){
        let query1 = `INSERT INTO Veterinarians (name, email)
                      VALUES (?, ?)`;
        var inserts = [req.body.name, req.body.email];
        db.pool.query(query1, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            else {
                res.redirect('/vets');
            }
        });
    });

    return router;
}();