var Sequelize = require("sequelize");
var sequelize = require(__dirname + "/../../lib/sequelize");

var Delivery = sequelize.define('service', {
	delivery_id : {
		type: Sequelize.STRING,
		allowNull : false
		unique: true
	},
	item_name : {
		tyep : Sequelize.STRING,
		allowNull : false,
	},
	item_image : {
		type : Sequelize.STRING,
		allowNull : false
	},
	sender_id : {
		type : Sequelize.STRING,
		allowNull : false
	},
	receiver_id : {
		type : Sequelize.STRING,
		allowNull : false
	},.
	rider_id : {
		type : Sequelize.STRING,
		allowNull : false
	},
	total_cost : {
		type : Sequelize.DOUBLE,
		allowNull : false
	}
});

Delivery.sync({force : false});
module.exports = Delivery;