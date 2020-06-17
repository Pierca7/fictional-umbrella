import { MongoClient } from "mongodb";
import config from "../config";

const uri = `mongodb+srv://pierca-mongo:${config.mongopass}@cluster0-zzubj.azure.mongodb.net/${config.mongodb}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

// client.connect(err => {
//   const collection = client.db("playlists").collection("playlists");

//   collection.
//   // perform actions on the collection object
//   client.close();
// });

// export class DataService
