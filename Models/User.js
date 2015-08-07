var mysql = require('mysql');
connection = mysql.createConnection(
	{
	host: 'localhost',
	user: 'root',  
	password: '123456',
	database: 'API'
	}
);

var userModel = {};

//Get ALL users
userModel.getUsers = function(callback)
{
	if (connection)
	{
		connection.query('SELECT * FROM users ORDER BY id', function(error, rows) {
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

//Get user by ID
userModel.getUser = function(id,callback)
{
	if (connection)
	{
		var sql = 'SELECT * FROM users WHERE id = ' + connection.escape(id);
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

//Add user
userModel.insertUser = function(userData,callback)
{
	if (connection)
	{
		connection.query('INSERT INTO users SET ?', userData, function(error, result)
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

//Update User name
userModel.updateUser = function(userData, callback)
{
	//console.log(userData); return;
	if(connection)
	{
		var sql = 'UPDATE users SET name = ' + connection.escape(userData.name) + ',' +  
		'email = ' + connection.escape(userData.email) +
		'WHERE id = ' + userData.id;
		 
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

//Delete User
userModel.deleteUser = function(id, callback)
{
	if(connection)
	{
		var sqlExists = 'SELECT * FROM users WHERE id = ' + connection.escape(id);
		connection.query(sqlExists, function(err, row)
		{
			//si existe la id del usuario a eliminar
			if(row)
			{
				var sql = 'DELETE FROM users WHERE id = ' + connection.escape(id);
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
module.exports = userModel;