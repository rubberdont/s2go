'use strict';
var User = require(__dirname + '/../models/user');

exports.reqToken = function (req, res, next){
	var access_token = req.get('Access-Token');
	if(!access_token && ('' + access_token).trim().length === 0){
		return res.status(403).send("Missing Access-Token in headers");
	}
	User.findOne({
		where: {
			access_token : access_token
		}
	}).then(function (user){
		if(user){
			req.user = user;
			next();
		}else{
			res.status(400).send({
				error : true,
				message : "User not found"
			});
		}
	}).catch(function (err){
		res.status(500).send({
			error : true,
			message : err
		});
	});
};
exports.checkToken = function (req, res, next){
	var access_token = req.get('Access-Token');
	if(access_token && ('' + access_token).trim().length > 0){
		User.findOne({
			where: {
				access_token : access_token
			}
		}).then(function (user){
			if(user){
				req.user = user;
				next();
			}else{
				res.status(400).send({
					error : true,
					message : "User not found"
				});
			}
		}).catch(function (err){
			res.status(500).send({
				error : true,
				message : err
			});
		});
	}else{
		next();
	}
};