import { Mongoose, ConnectOptions } from 'mongoose';

interface CustomConnectOptions extends ConnectOptions {
  reconnectInterval: number;
}

interface ConnectionModule {
  connectToMongo: () => void;
}

export default function mongoDbConnection(
  mongoose: Mongoose,
  config: { MONGO_URI: string },
  options: CustomConnectOptions
): ConnectionModule {
  function connectToMongo(): void {
    mongoose
      .connect(config.MONGO_URI, {
        autoIndex: options.autoIndex,
        connectTimeoutMS: options.connectTimeoutMS
      })
      .then(() => {})
      .catch((err) => {
        console.log('ERROR:', err);
      });
  }

  mongoose.connection.on('connected', () => {
    console.info('Connected to MongoDB!');
  });

  mongoose.connection.on('reconnected', () => {
    console.info('MongoDB reconnected!');
  });

  mongoose.connection.on('error', (error) => {
    console.error(`Error in MongoDB connection: ${error}`);
    mongoose.disconnect();
  });

  mongoose.connection.on('disconnected', () => {
    console.error(
      `MongoDB disconnected! Reconnecting in ${
        options.reconnectInterval / 1000
      }s...`
    );
    setTimeout(() => connectToMongo(), options.reconnectInterval);
  });

  return {
    connectToMongo
  };
}
