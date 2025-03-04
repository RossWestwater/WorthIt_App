// user controller

const { User } = require("../models")

// user login
const userController = {
	loginUser: async function (req, res, next) {
		try {
			User.findOne(
				{
					username: req.body.username
				},
				function (err, user) {
					if (err) throw err;
	
					if (!user) {
						res.status(401).json({
							success: false,
							msg: "Unable to authenticate.",
						});
					} else {
						user.comparePassword(req.body.password, function (err, isMatch) {
							if (isMatch && !err) {
								var token = genToken(user.toJSON());
								res.status(200).json({ success: true, token: token });
							} else {
								res.status(401).json({
									success: false,
									msg: "Unable to password.",
								});
							}
						});
					}
				}
			);
		} catch (err) {
			return res.status(500).json(err);
		}
	},

	// get all users
	getUsers: async function (req, res) {
		try {
			const userData = await User.find()
			res.json(userData)
		} catch (error) {
			res.status(500).json(error)
		}
	},

	// delete individual user by id
	removeUser: async function ({params}, res) {
		try {
			const userData = await User.findByIdAndDelete(params.userId)
			res.json(userData)
		} catch (error) {
			res.status(500).json(error)
		}
	},

	// create a new user
	createUser: async function (req, res, next) {
		try {
			if (!req.body.username || !req.body.password) {
				res.status(400).json({ success: false, msg: "Please review the username and password." });
			} else {
        var newUser = new User({
          username: req.body.username,
					password: req.body.password
				});
	
				newUser.save(function (err) {
					if (err) {
						console.log(err)
						return res.status(400).json({ success: false, msg: "Username already exists." });
					}
					var token = genToken(newUser.toJSON());
					res.status(200).json({ success: true, token: token });
				});
			}
		} catch (err) {
			return res.status(500).json(err);
		}
	},

	// get individual user by id
	getUser: async function ({params}, res) {
		try {
			const userData = await User.findById(params.userId)
			res.json(userData)
		} catch (error) {
			res.status(500).json(error)
		}
	},

	// make updates to existing user
	editUser: async function ( {params, body}, res) {
		try {
			const userData = await User.findByIdAndUpdate(
				{_id: params.userId},
				{
					speed: body.speed,
					pay: body.pay,
					gasPrice: body.gasPrice,
					mpg: body.mpg,
					pickUpTime: body.pickUpTime
				},
				{new: true}
				)
			res.json(userData)
		} catch (error) {
			res.status(500).json(error)
		}
	}
	
}


module.exports = userController