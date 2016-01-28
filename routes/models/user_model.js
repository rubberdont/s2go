var Sequelize = require("sequelize");
var sequelize = require(__dirname + "/../../lib/sequelize");
var bcrypt    = require('bcrypt-nodejs');

var User = sequelize.define("user", {
	first_name : {
		type : Sequelize.STRING,
		allowNull : false
	},
	last_name : {
		type : Sequelize.STRING
	},
	email : {
		type : Sequelize.STRING,
		unique: true,
		allowNull : false
	},
	password : {
		type : Sequelize.STRING,
		allowNull : false
	},
	phone_number : {
		type: Sequelize.STRING,
		allowNull : false
	},
	access_token : {
	  	type : Sequelize.STRING,
	  	defaultValue : Sequelize.UUIDV1,
	  	unique : true
	},
	provider: {
	  	type: Sequelize.STRING,
	  	unique : 'socialUnique'
	},
	oauth_id: {
	  	type : Sequelize.STRING,
	  	unique : 'socialUnique'
	}
}, {
	classMethods :{
		getFullName: function (){
			return [this.first_name, this.last_name].join(' ');
		},
		generateHash: function (password){
			return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
		},
		validPassword: function (input, password){
			return bcrypt.compareSync(input, password);
		},
		updateAccessToken : function (id, user, callback){
			var temp_token;
			var token;
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		    for( var i=0; i < 8; i++ ){
		    	temp_token += possible.charAt(Math.floor(Math.random() * possible.length));
		    }
		    token = bcrypt.hashSync(temp_token, bcrypt.genSaltSync(8), null);
		    this.update({
		    	access_token : token
		    },{
		    	where : {
		    		id : id
		    	}
		    }).then(function (result){
		    	if(result > 0){
		    		callback(null, token);
		    	}else{
		    		callback({
		    			error : true,
		    			message : "Failed to update access_token"
		    		}, null);
		    	}
		    }).catch(function (err){
		    	callback({
		    		error : true,
		    		message : err
		    	}, null);
		    });
		}
	}
});

User.sync({force: false});
module.exports = User;