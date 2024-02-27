// This is a middleware function
const jwt = require("jsonwebtoken");
const JWT_SECRET = "My name is Atul"; // this is example of jwt token secret signature which we should store in env.local or in config to keep it secrete ( here we donot saved in env.local for understanding the concept)

const fetchUser = (req, res, next) => {
  // Get user from JWT token and add id to the req object
  const token = req.header("auth-token"); // token is taken from request header which name is auth-token
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" }); // if token is not available then send error.
  }

  try {
    const data = jwt.verify(token, JWT_SECRET); // checking our JWT_SECRET (signature) whether match to the token or not with the help of verify method of jwt.
    //console.log(data); // if token match it send the user object with two keys (id and iat)
    req.user = data.id; // if the token is matched then that id from data object is send to user of req
    next(); // next function call which is present next to call of this middleware function.
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchUser;
