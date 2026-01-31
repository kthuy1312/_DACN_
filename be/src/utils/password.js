const bcrypt = require("bcryptjs");

// hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// compare password
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword,
};
