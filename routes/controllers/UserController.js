/**
 * http://usejsdoc.org/
 */
var async = require('async');
var Sequelize = require('sequelize');
var User = require(__dirname + '/../models/user');

/**
 * @api {POST} /users/login
 * @apiName User Login
 * @apiGroup User
 * @apiDescription Request user login
 * @apiParam {STRING} email 
 * @apiParam {STRING} password
 * @apiSuccess JSON "User information/Data"
 * @apiError JSON "{error : true/false, message: err msg}"
 * @apiVersion 0.0.1
*/
exports.login = function (req, res){
	if(req.body.email === undefined && ('' + req.body.email).trim().length === 0){
		return res.status(404).send({
			error : true,
			message : "Missing email"
		});
	}
	if(req.body.password === undefined && ('' + req.body.password).trim().length === 0){
		return res.status(404).send({
			error : true,
			message : "Missing password"
		});
	}
	User.findOne({
		where: {
			email: req.body.email
		}
	}).then(function (user){
		if(user){
			if(!User.validPassword(req.body.password, user.password)){
				res.status(400).send({
					error : true,
					message : "Wrong password"
				});
			}else{
				User.updateAccessToken(user.id, User, function (err, newToken){
					if(err){
						res.status(400).send(err);
					}else{
						user.access_token = newToken;
						res.status(200).send(user);
					}
				});
			}
		}else{
			res.status(404).send({
				error : true,
				message : "User not found"
			});
		}
	}).catch (function (err){
		res.status(500).send({
			error : true,
			message : err
		});
	});
};

/**
 * @api {POST} /users/social_login
 * @apiName User Login using third party
 * @apiGroup User
 * @apiDescription Request user social login
 * @apiParam {STRING} provider Name of social media (e.g Facebook, Google Plus)
 * @apiParam {STRING} oauth_id Generated Id by the social media SDK
 * @apiSuccess User info
 * @apiError JSON "{error : true/false, message: err msg}"
 * @apiVersion 0.0.1
*/
exports.socialLogin = function (req, res){
	if(req.body.provider === undefined && ('' + req.body.provider).trim().length === 0){
		return res.status(404).send({
			error : true,
			message : "Missing provider"
		});
	}
	if(req.body.oauth_id === undefined && ('' + req.body.oauth_id).trim().length === 0){
		return res.status(404).send({
			error : true,
			message : "Missing oauth_id"
		});
	}
	User.findOne({
		where: {
			provider: req.body.provider,
			oauth_id : req.body.oauth_id
		}
	}).then(function (user){
		if(user){
			User.updateAccessToken(user.id, User, function (err, newToken){
				if(err){
					res.status(400).send(err);
				}else{
					user.access_token = newToken;
					res.status(200).send(user);
				}
			});
		}else{
			res.status(404).send({
				error : true,
				message : "User not found"
			});
		}
	}).catch (function (err){
		res.status(500).send({
			error : true,
			message : err
		});
	});
};

/**
 * @api {GET} /users
 * @apiName Get Users
 * @apiGroup User
 * @apiDescription user listing
 * @apiSuccess array of users
 * @apiVersion 0.0.1
*/
exports.getUsers = function (req, res){
	User.findAll({
		attributes: { exclude: ['password'] }
	}).then(function (users){
			res.status(200).send(users);
		})
		.catch(function (err){
			res.status(500).send({
				error : true, 
				message : err
			});
		}).done();
};

/**
 * @api  {POST} /users/social_create
 * @apiName Create New User using third party login
 * @apiGroup User
 * @apiParam {STRING} email
 * @apiParam {STRING} password
 * @apiParam {STRING} first_name
 * @apiParam {STRING} provider Name of social media (e.g Facebook, Google Plus)
 * @apiParam {STRING} oauth_id Generated Id by the social media SDK
 * @apiSuccess JSON "User information/data"
 * @apiError JSON "{error : true, message: err msg}"
 * @apiVersion 0.0.1
*/
exports.socialCreateUser = function (req, res){
	var tempPass  = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for(var i=0; i < 6; i++){
		tempPass += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	req.body.password = User.generateHash(tempPass);
	if(req.body.provider == undefined || req.body.provider.trim().length == 0){
		return res.status(404).send({
			error : true,
			message : "Missing provider"
		});
	}
	if(req.body.oauth_id == undefined || ("" + req.body.oauth_id).trim().length == 0){
		return res.status(404).send({
			error : true,
			message : "Missing oauth_id"
		});
	}
	User.create(req.body)
		.then (function (user){
			var result = user;
			delete result.password;
			res.status(200).send({
				error: false,
				user : result
			});
		})
		.catch (function (err){
			console.log(err);
			res.status(500).send({
				error : true,
				message : err
			});
		}).done();
};

/**
 * @api  {POST} /users/create
 * @apiName Create New User
 * @apiGroup User
 * @apiParam {STRING} email
 * @apiParam {STRING} password
 * @apiParam {STRING} first_name
 * @apiParam {STRING} last_name
 * @apiSuccess JSON "User information/data"
 * @apiError JSON "{error : true, message: err msg}"
 * @apiVersion 0.0.1
*/
exports.createUser = function (req, res){
	if(req.body.password != undefined && req.body.password.trim().length > 0){
		var tempPass = req.body.password;
		req.body.password = User.generateHash(tempPass)
	}
	User.create(req.body)
		.then (function (user){
			var result = user;
			delete result.password;
			res.status(200).send({
				error: false,
				user : result
			});
		})
		.catch (function (err){
			console.log(err);
			res.status(404).send({
				error : true,
				message : err.errors
			});
		}).done();
};

/**
 * @api  {PUT} /users/:id
 * @apiName UpdateUser
 * @apiGroup User
 * @apiDescription update existing user info
 * @apiHeader (MyHeaderGroup) {String} Access-Token access_token value.
 * @apiParam (Login) {INTEGER} id
 * @apiSuccess JSON "User information/data" 
 * @apiError JSON "{error : true, message: err msg}"
 * @apiVersion 0.0.1
*/
exports.updateUser = function (req, res){
	if(req.params.id === undefined){
		return res.status(404).send({
			error : true,
			message : "Missing params id"
		});
	}
	User.update(req.body, {
		where : {
			id: req.params.id
		}
	}).then(function (result){
		if(result > 0){
			res.status(200).status({
				error : false,
				message : "Update success"
			});
		}else{
			res.status(200).status({
				error : false,
				message : "Update failed"
			});
		}
		
	}).catch (function (err){
		res.status(500).send({
			error : true,
			message : err
		});
	}).done()
};