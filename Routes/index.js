var UserModel = require('../Models/User');
var passwordHash = require('password-hash');

module.exports = function(app){

	//Route for update user
	app.get("/user/update/:id",function(req,res){
		var id = req.params.id;
		if (!isNaN(id)) {
			UserModel.getUser(id,function(error,data){
				if(typeof data !== 'undefined' && data.length>0){
					res.render("index",{
						title	: "Formulario",
						info	: data
					});
				}
				else
				{
					res.json(404,{"msg":"notExist"});
				}
			});
		}
		else
		{
			res.json(500,{"msg":"The id must be numeric"});
		}
	});
	//Route for create user
	app.get("/create",function(req,res){
		res.render("new",{
			title: "Formulario para crear un nuevo recurso"
		});	
	});

	//Route for delete user
	app.get("/delete",function(req,res){
		res.render("delete",{
			title :"Formulario para eliminar un recurso"
		});
	});

	//Route for all users
	app.get("/users",function(req,res){
		UserModel.getUsers(function(error,data){
			res.json(200,data);
		});
	});

	//Route to find user by id
	app.get("/users/:id",function(req,res){
		var id = req.params.id;
		if (!isNaN(id)) {
			UserModel.getUser(id,function(error,data){
				if (typeof data !== 'undefined' && data.length > 0){
					res.json(200,data);
				}
				else
				{
					res.json(404,{"msg":"notExist"});
				}
			});
		}
		else
		{
			res.json(500,{"msg":"Error"})
		}
	});

	app.post("/users",function(req,res){
		var userData = {
			id : null,
			name : req.body.name,
			lastname : req.body.lastname,
			email : req.body.email,
			password : passwordHash.generate(req.body.password)
		};
		UserModel.insertUser(userData,function(error,data){
			if (data && data.insertId) {
				res.redirect("/users/" + data.insertId);
			}
			else{
				res.json(500,{"msg":"Error"});
			}
		});
	});


	app.put("/users",function(req,res){
		var userData = {id:req.param('id'),
						name:req.param('name'),
						lastname:req.param('lastname'),
						email:req.param('email')
		};
		UserModel.updateUser(userData,function(error,data)
		{
			if(data&&data.msg){
				res.json(200,data);
			}
			else
			{
				res.json(500,{"msg":"Error"});
			}
		});
	});

	app.delete("/users/:id",function(req,res){
		var id = req.params.id;
		UserModel.deleteUser(id,function(error,data)
		{
			if (data && data.msg === "deleted" || data.msg === "notExist") {
				res.json(200,data);
			}
			else
			{
				res.json(500,{"msg":"Error"});
			}
		});
	});
}