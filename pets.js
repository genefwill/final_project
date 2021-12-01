module.exports = function(){
	var express = require('express');
	var router = express.Router();
    var db = require('./database/dbcon');

	function getOwners(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM Owners", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.owners  = results;
            complete();
        });
    }


	function getPets(res, mysql, context, complete){
		let query1 = `SELECT petID, givenName, owner, species, dateOfBirth, sex, weight FROM Pets p INNER JOIN Owners o ON p.owner = o.ownerID;`;
		
		mysql.pool.query(query1, function(error, results, fields){	 
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}

			context.pets = results;
			complete();
		})
	}

	// Display all Pets. 
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deletePets.js"];

		var mysql = req.app.get('mysql');
		
		getPets(res, mysql, context, complete);
		getOwners(res, mysql, context, complete);

		function complete(){
			callbackCount++;

			if(callbackCount >= 2){
				res.render('pets', context);
			}
		}
	})

    router.post('/addPet', function(req, res){
        console.log(req.body.owner);
        console.log(req.body);

        if (isNaN(req.body.owner)) {
            //Create query and run it on the db, don't include value for dateOfBirth
            let query1 = 'INSERT INTO Pets (givenName, owner, species, sex, weight) VALUES (?, ?, ?, ?, ?)';
            let inserts = [req.body.givenName, req.body.owner, req.body.species, req.body.sex, req.body.weight];
            db.pool.query(query1, inserts, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.redirect('/pets');
                }
            })
        }
        else {
            let query2 = 'SELECT MAX(petID) as petID FROM Pets WHERE givenName = ? and owner = ? and species = ? dateOfBirth = ? and sex = ? and weight = ?';
            let insert2 = [req.body.givenName, req.body.owner, req.body.species, 
                            req.body.dateOfBirth, req.body.sex, req.body.weight];
            mysql.pool.query(query2, insert2, function(error, rows, fields){
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.redirect('/pets');
                }
            })
        }
    });


    return router;
}();