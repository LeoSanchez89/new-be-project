//make jwtSecret file and import where needed (middleware and auth router)

module.exports = {
	jwtSecret: process.env.JWT_SECRET || "is it secret, is it safe?",
};
