module.exports = function(){
	var express = require('express');
	var router = express.Router();

	function getPets(res, mysql, context, complete){
		let query1 = `SELECT petID, givenName FROM Pets`;
		
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
		let query1 = `SELECT vetID, name FROM Veterinarians`;
		
		mysql.pool.query(query1, function(error, results, fields){	 
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}

			context.vets = results;
			complete();
		})
	}
	function getVetsPets(res, mysql, context, complete){
		let query1 = `SELECT vet, pet FROM VetsPets vp 
                          INNER JOIN Veterinarians v ON vp.vet = v.vetID
                          INNER JOIN Pets p ON vp.pet = p.petID`;
		
		mysql.pool.query(query1, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}

			context.vetsPets = results;
			complete();
		})
	}


	// Display all VetsPets. 
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteOwner.js"];

		var mysql = req.app.get('mysql');

		getVetsPets(res, mysql, context, complete);
		getVets(res, mysql, context, complete);
		getPets(res, mysql, context, complete);
		

		function complete(){
			callbackCount++;

			if(callbackCount >= 3){
				res.render('vetsPets', context);
			}
		}
	})


	// Add a new Owner row
    // router.post('/', function(req, res){
    // 	if (isNaN(email))
    //     {
    //         req.body.email = null;
    //     }
    //     if (isNaN(address2))
    //     {
    //         req.body.address2 = null;
    //     }

    //     let query1 = `INSERT INTO Owners (firstName, lastName, email, phoneNumber, address1, address2, city, state, zipCode)
    //                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    //     var inserts = [req.body.firstName, req.body.lastName, req.body.email, req.body.phoneNumber, req.body.address1, 
    //     			   req.body.address2, req.body.city, req.body.state, req.body.zipCode];
    //     mysql.pool.query(query1, inserts, function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         else {
    //             res.redirect('/owners');
    //         }
    //     });
    // });

    return router;
}();