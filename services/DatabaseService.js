const mongoose = require('mongoose');

class DatabaseService {
    constructor() {
        this.mongoURI = process.env['MONGO_URI'];
    }

    connect() {
        mongoose.connect(
            this.mongoURI, 
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
    }
}

module.exports = new DatabaseService();