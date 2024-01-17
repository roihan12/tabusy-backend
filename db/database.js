import mongoose from "mongoose";

const { MONGODB_PASSWORD, MONGODB_USERNAME, MONGODB_DBNAME } = process.env;

const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.atpaeyo.mongodb.net/${MONGODB_DBNAME}?retryWrites=true&w=majority`;

const connectDatabase = () => {
  mongoose
    .connect(uri, {
    })
    .then((data) => {
      console.log(`mongodb connectted with server ${data.connection.host}`);
    });
};



export default connectDatabase;