var UserModel 	= require('../Models/User');
var bcrypt 		= require('bcryptjs');
var salt 		= bcrypt.genSaltSync(10);
var TaskModel	= require('../Models/Task');
var mandrill = require('node-mandrill')('6B_H9pFypH7Zq6erNCou-w');

module.exports = function(app){

	function isEmpty(myObject) {
	    for(var key in myObject) {
	        if (myObject.hasOwnProperty(key)) {
	            return false;
	        }
	    }
	return true;
	}

	//Send email
	app.get("/email",function(req,res){
		mandrill('/messages/send', {
		    message: {
		        to: [{email: 'carluzhozz@gmail.com', name: 'Carlos'}],
		        from_email: 'noreply@ati.com',
		        subject: "Hey, what's up?",
		        text: "Hello, I sent this message using mandrill."
		    }
		}, function(error, response)
		{
		    //uh oh, there was an error
		    if (error) console.log( JSON.stringify(error) );

		    //everything's good, lets see what mandrill said
		    else console.log("response");
		});
	});

	//Route for all task
	app.get("/tasks",function(req,res){
		TaskModel.getTasks(function(error,data){
			res.json(200,data);
		});
	});

	//Route to find task by id
	app.get("/tasks/:id",function(req,res){
//>>>>>>> origin/master
		var id = req.params.id;
		if (!isNaN(id)) 
		{
			TaskModel.getTask(id,function(error,data){
				if (typeof data !== 'undefined' && data.length > 0) {
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

	//Route to find Tasks by user_id
	app.get("/tasks/users/:users_id",function(req,res){
		var users_id = req.params.users_id;
		console.log(users_id);
		if (!isNaN(users_id)) 
		{
			TaskModel.getUTasks(users_id,function(error,data){
				if (typeof data !== 'undefined' && data.length > 0) 
				{
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

	//Create Task
	app.post("/tasks/:users_id",function(req,res){
		var p = 0;
		if (req.body.date_planned)
		{
			p = 1;
		}

		var taskData =
		{
			id : null,
			users_id : req.params.users_id,
			description : req.body.description,
			date_create : req.body.date_create,
			date_planned : req.body.date_planned,
			type : req.body.type,
			priority : p,
			reminder : req.body.reminder
		};

		console.log(taskData);
		TaskModel.insertTask(taskData,function(error,data){
			if (data && data.insertId) {
				res.redirect("/tasks/" + data.insertId);
			}
			else{
				res.json(500,{"msg":"Error"});
			}
		});
	});

	//Update task
	app.put("/tasks",function(req,res){
		
		var taskData = {id:req.param('id'),
						users_id:req.param('users_id'),
						description:req.param('description'),
						date_create:req.param('date_create'),
						date_planned:req.param('date_planned'),
						type:req.param('type'),
						priority:req.param('priority'),
						reminder:req.param('reminder')
		};
		console.log(taskData);
		TaskModel.updateTask(taskData,function(error,data)
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

	//Delete task by id
	app.delete("/tasks/:id",function(req,res){
		var id = req.params.id;
		TaskModel.deleteTask(id,function(error,data)
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

	//Route for user by email and password
	app.post("/users/login",function(req,res){
		var userData = {
			email : req.body.email,
			password : bcrypt.hashSync(req.body.password, salt)
		};
		UserModel.getUserByEmail(userData,function(error,data)
		{
			if (typeof data !== 'undefined' && data.length > 0) 
				{
					req.session.id = data.id;
					res.json(200,data);
				}
				else
				{
					res.json(404,{"msg":"notExist"});
				}
		})
	})

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

	//Create user
	app.post("/users",function(req,res){
		var userData = {
			id : null,
			name : req.body.name,
			lastname : req.body.lastname,
			email : req.body.email,
			password : bcrypt.hashSync(req.body.password, salt)
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

	//Update user
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


	//Delete user by id
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