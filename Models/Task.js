var mysql = require('mysql');
connection = mysql.createConnection(
	{
	host: 'localhost',
	user: 'root',  
	password: '123456',
	database: 'API'
	}
);

var taskModel = {};

//Get All tasks
taskModel.getTasks = function(callback)
{
	if (connection)
	{
		connection.query('SELECT * FROM tasks ORDER BY users_id', function(error, rows) {
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, rows);
			}
		});
	}
}

//Get Task by users_id
taskModel.getUTasks = function(id,callback)
{
	if (connection) 
	{
		var sql = 'SELECT * FROM tasks WHERE users_id = ' + connection.escape(id);
		connection.query(sql, function(error, row)
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, row);
			}
		});
	}
}

//Get Task by id
taskModel.getTask = function(id,callback)
{
	if (connection)
	{
		var sql = 'SELECT * FROM tasks WHERE id = ' + connection.escape(id);
		connection.query(sql, function(error, row)
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, row);
			}
		});
	}
}

//Add task
taskModel.insertTask = function(taskData,callback)
{
	if (connection)
	{
		connection.query('INSERT INTO tasks SET ?', taskData, function(error, result)
		{
			if(error)
			{
				throw error;
			}
			else
			{
				//devolvemos la última id insertada
				callback(null,{"insertId" : result.insertId});
			}
		});
	}
}


//Update Task
taskModel.updateTask = function(taskData, callback)
{
	//console.log(userData); return;
	if(connection)
	{
		var sql = 'UPDATE tasks SET description = ' + connection.escape(taskData.description) + ',' + 
		'date_create = ' + connection.escape(taskData.date_create) + ',' +
		'date_planned = ' + connection.escape(taskData.date_planned) + ',type = ' + connection.escape(taskData.type) +
		' WHERE id = ' + taskData.id;
		 console.log(sql);
		connection.query(sql, function(error, result)
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null,{"msg":"success"});
			}
		});
	}
}

//Delete Task
taskModel.deleteTask = function(id, callback)
{
	if(connection)
	{
		var sqlExists = 'SELECT * FROM tasks WHERE id = ' + connection.escape(id);
		connection.query(sqlExists, function(err, row)
		{
			//si existe la id del usuario a eliminar
			if(row)
			{
				var sql = 'DELETE FROM tasks WHERE id = ' + connection.escape(id);
				connection.query(sql, function(error, result)
				{
					if(error)
					{
						throw error;
					}
					else
					{
						callback(null,{"msg":"deleted"});
					}
				});
			}
			else
			{
				callback(null,{"msg":"notExist"});
			}
		});
	}
}
 
//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = taskModel;