"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mongoDbConnection(mongoose, config, options) {
    function connectToMongo() {
        mongoose
            .connect(config.MONGO_URI, {
            autoIndex: options.autoIndex,
            connectTimeoutMS: options.connectTimeoutMS
        })
            .then(function () { })
            .catch(function (err) {
            console.log('ERROR:', err);
        });
    }
    mongoose.connection.on('connected', function () {
        console.info('Connected to MongoDB!');
    });
    mongoose.connection.on('reconnected', function () {
        console.info('MongoDB reconnected!');
    });
    mongoose.connection.on('error', function (error) {
        console.error("Error in MongoDB connection: ".concat(error));
        mongoose.disconnect();
    });
    mongoose.connection.on('disconnected', function () {
        console.error("MongoDB disconnected! Reconnecting in ".concat(options.reconnectInterval / 1000, "s..."));
        setTimeout(function () { return connectToMongo(); }, options.reconnectInterval);
    });
    return {
        connectToMongo: connectToMongo
    };
}
exports.default = mongoDbConnection;
