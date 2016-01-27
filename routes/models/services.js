var Sequelize = require("sequelize");
var sequelize = require(__dirname + "/../../lib/sequelize");

var Service = sequelize.define('service', {
	unique_value : {
		type: Sequelize.STRING,
		allowNull : false
		unique: true
	},
	service_name : {
		tyep : Sequelize.STRING,
		allowNull : false,
		unique: true
	},
	icon : {
		type : Sequelize.STRING,
		allowNull : true
	},
	status : {
		type : Sequelize.STRING,
		allowNull : true
	}
});

Service.sync({force : false});
module.exports = Service;