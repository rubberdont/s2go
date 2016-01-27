var express = require('express');
var router = express.Router();
var UserController = require(__dirname + "/controllers/UserController");
var auth = require(__dirname + '/controllers/AuthController');


/* GET users listing. */
router.get('/', UserController.getUsers);
router.post('/login', UserController.login);
router.post('/create', UserController.createUser);
router.put('/update/:id', auth.reqToken, UserController.updateUser);

module.exports = router;