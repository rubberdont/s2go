var express = require('express');
var router = express.Router();
var UserController = require(__dirname + "/controllers/UserController");
var auth = require(__dirname + '/controllers/AuthController');


// GET users listing.
router.get('/', auth.requireToken, UserController.getUsers);
// User login
router.post('/login', UserController.login);
// User registration
router.post('/create', UserController.createUser);
//User update
router.put('/update/:id', auth.requireToken, UserController.updateUser);

module.exports = router;