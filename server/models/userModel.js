const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    type: {
        type: Number,
        require: true
    },
    token: { type: String },
});

module.exports = mongoose.model("user", userSchema);