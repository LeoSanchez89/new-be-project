const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../users/users-model.js");
const { jwtSecret } = require("../config/secrets.js");

//  url/api/auth
router.post("/register", (req, res) => {
	let new_user = req.body;

	Users.findBy(new_user.username)
		.first()
		.then((user) => {
			if (!user) {
				const hash = bcrypt.hashSync(new_user.password, 10);
				new_user.password = hash;

				Users.add(new_user)
					.then((saved) => {
						res.status(201).json(saved);
					})
					.catch((error) => {
						res.status(500).json(error);
					});
			} else {
				res.status(409).json({
					message: `Username: ${user.username} already exists. Please login.`,
				});
			}
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});

router.post("/login", (req, res) => {
	let { username, password } = req.body;

	Users.findBy(username)
		.first()
		.then((user) => {
			if (user && bcrypt.compareSync(password, user.password)) {
				const token = generateToken(user);

				res.status(200).json({
					message: `Welcome ${user.username}!`,
					token,
				});
			} else {
				res.status(401).json({ message: "Invalid Credentials" });
			}
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});

function generateToken(user) {
	const payload = {
		subject: user.id,
		username: user.username,
		department: user.department,
		role: user.role || "user",
	};

	const options = {
		expiresIn: "1h",
	};

	return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
