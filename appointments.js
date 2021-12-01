module.exports = function(){
	var express = require('express');
	var router = express.Router();
	var db = require('./database/dbcon');

    

	function getPets(res, mysql, context, complete){
		let query1 = `SELECT petID, givenName FROM Pets;`;
		
		mysql.pool.query(query1, function(error, results, fields){	 
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}

			context.pets = results;
			complete();
		})
	}

	function getVets(res, mysql, context, complete){
		let query1 = `SELECT vetID, name FROM Veterinarians;`;		
		mysql.pool.query(query1, function(error, results, fields){	 
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}

			context.vets = results;
			complete();
		})
	}

	function getAppts(res, mysql, context, complete){
		let query1 = `SELECT apptID, apptDateTime, endTime, reason, pet, vet FROM Appointments appt 
                      INNER JOIN Pets p ON appt.pet = p.petID 
                      INNER JOIN Veterinarians v ON appt.vet = v.vetID;`;
		mysql.pool.query(query1, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}

			context.appts = results;
			complete();
		})
	}

	// Display all Appts. 
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteAppts.js"];

		var mysql = req.app.get('mysql');
		getAppts(res, mysql, context, complete);
		getVets(res, mysql, context, complete);
		getPets(res, mysql, context, complete);

		function complete(){
			callbackCount++;

			if(callbackCount >= 3){
				res.render('appts', context);
			}
		}
	})


	// Add a new Appt row
    router.post('/', function(req, res){
        // Capture NULL values


        // Add the record with potential null values captured
        let query1 = `INSERT INTO Appointments (apptDateTime, endTime, reason, pet, vet)
                      VALUES (?, ?, ?, ?, ?)`;
        var inserts = [req.body.apptDateTime, req.body.endTime, req.body.reason, req.body.pet, req.body.vet];
        db.pool.query(query1, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            else {
                res.redirect('/appts');
            }
        });
    });

    return router;
}();