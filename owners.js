module.exports = function(){
	var express = require('express');
	var router = express.Router();
    var db = require('./database/dbcon');

	function getOwners(res, mysql, context, complete){
		let query1 = `SELECT ownerID, firstName, lastName, email, phoneNumber, address1, address2, city, state, zipCode FROM Owners;`;
		
		mysql.pool.query(query1, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}

			context.owners = results;
			complete();
		})
	}

    function getOwner(res, mysql, context, id, complete){
        var sql = "SELECT ownerID as id, firstName, lastName, email, phoneNumber, address1, address2, city, state, zipCode FROM Owners WHERE ownerID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            complete();
        });
    }


	// Display all Owners. 
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteOwner.js"];

		var mysql = req.app.get('mysql');
		getOwners(res, mysql, context, complete);

		function complete(){
			callbackCount++;

			if(callbackCount >= 1){
				res.render('owners', context);
			}
		}
	});

    function getOwnersWithNameLike(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
         var query = "SELECT Owners.ownerID as id, firstName, lastName, email, phoneNumber, address1, address2, city, state, zipCode FROM Owners WHERE Owners.lastName LIKE " + mysql.pool.escape(req.params.s + '%');
        console.log(query)
  
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.owners = results;
              complete();
          });
      }
  

    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteOwner.js, searchOwners.js"];
        var mysql = req.app.get('mysql');
        getOwnersWithNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('owners', context);
            }
        }
    });

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


    router.post('/', function(req, res){
        // Capture NULL values


        // Add the record with potential null values captured
        let query1 = `INSERT INTO Owners (firstName, lastName, email, phoneNumber, address1, address2, city, state, zipCode)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        var inserts = [req.body.firstName, req.body.lastName, req.body.email, req.body.phoneNumber, req.body.address1, req.body.address2, req.body.city, req.body.state, req.body.zipCode];
        db.pool.query(query1, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            else {
                res.redirect('/owners');
            }
        });
    });

    //Updating Owner



    /* Route to delete an owner, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:ownerID', function(req, res){
        var query1 = "DELETE FROM Owners WHERE ownerID = ?";
        var inserts = [req.params.ownerID];
        
        mysql.pool.query(query1, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    });

    return router;
}();