/* eslint-disable no-console */
import { ConnectionOptions, connect } from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri: string = process.env.MONGODB_CONNECTION_STRING;
    const options: ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      dbName: "bumblebee",
    };

    await connect(mongoUri, options);
  } catch (err) {
    console.log(err);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
