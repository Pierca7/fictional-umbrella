import config from "../config";
import { ConnectionOptions, connect } from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri: string = config.mongoUri;
    const options: ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      dbName: "bumblebee",
    };

    await connect(mongoUri, options);
  } catch (err) {
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
