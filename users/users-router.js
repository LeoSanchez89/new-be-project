const router = require("express").Router();

const Users = require("./users-model.js");

router.get("/", (req, res) => {
	Users.find()
		.then((users) => {
			res.json(users);
		})
		.catch((err) => res.send(err));
});

router.get("/:id", (req, res) => {
	Users.findById(req.params.id)
		.then((user) => {
			if (user) {
				res.json(user);
			} else {
				res.status(400).json({
					message: "User not found",
				});
			}
		})
		.catch((err) => res.send(err));
});

module.exports = router;
