const mongoose = require("mongoose");
// in mongoURI the database name is spicified immediately after host or port name
//const mongoURI = "mongodb+srv://atul:atulMandavkar@cluster0.9zpiovu.mongodb.net/inotebook?retryWrites=true&w=majority";  // in database we created a new database inotebook after / , for use of unique email address in database in url
const mongoURI = process.env.MONGO_URI_LINK; // Making mongoURI as env variable
/* we recommend using 127.0.0.1 instead of localhost. That is because Node.js 18 and up prefer IPv6 addresses, which means, on many machines, Node.js will resolve localhost to the IPv6 address ::1 and Mongoose will be unable to connect, unless the mongodb instance is running with ipv6 enabled. */
/* { autoCreate: true } is added in mongoose.connect() to create database if it is absent */
/* By setting autoCreate: true, Mongoose will attempt to create the database if it doesn't exist when you establish a connection using mongoose.connect(). If the database already exists, it will connect to it as usual.*/
const connectToMongo = async () =>{
    await mongoose
      .connect(mongoURI, {
        autoCreate: true,
      })
      .then(() => console.log("Database connected!"))
      .catch((err) => console.log(err));
}
//connectToMongo().catch((err) => console.log(err));

module.exports = connectToMongo;