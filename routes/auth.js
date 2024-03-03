const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");

//const JWT_SECRET = "My name is Atul"; // this is example of jwt token secret signature which we should store in env.local or in config to keep it secrete ( here we donot saved in env.local for understanding the concept)
const JWT_SECRET = process.env.JWT_SECRET_CODE; // Making JWT_SECRET as env variable

// route 1: Create a User using : POST "/api/auth/createUser"  and also doesn't require auth. where createUser is in api/auth
// use post method instead of get method of router because of user data is shown in get method but not in post method.
router.post(
  "/createUser",
  [
    body("name", "Enter proper name").isLength({ min: 4 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Minimum length is 8 for password").isLength({ min: 8 }),
  ],
  async (req, res) => {
    let success = false;
    //console.log(req.body); // to check xontent in req.body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      result.array().forEach((e) => console.log(e.msg));
      return res.status(400).send({ success, errors: result.array() });
    }

    try {
      const isUser = await User.findOne({ email: req.body.email }); // to find the user with same email already exist or not
      //console.log(isUser);
      if (isUser) {
        console.log("Email alredy exists");
        return res.status(400).send({ success, error: "Email already exists" });
      }
      const user = new User(req.body);
      //console.log(user["password"]); // in model User there is schema user which have key as password
      // befor Use saved we need to make plain text password to hash password (secure password)
      const salt = await bcrypt.genSaltSync(10); // async method for genating salt to make password more strong, salt is added to password by backend itself, no one know what is the value of salt
      const hash = await bcrypt.hash(user["password"], salt); // async method for convering normal plain text password to hash password along with adding salt before hashing.
      user["password"] = hash; // changing password in model User where schema name is user.
      await user
        .save()
        .catch((err) => console.log(err))
        .then(console.log("user is saved on database"));

      // when user successfully saved in database then we send him a json token
      const token = jwt.sign({ id: user.id }, JWT_SECRET); // sign method is used to create token, first paramete is object and second parameter is signatue which is a secrete.
      success = true;
      return res.send({ success, token }); // we send token to who signed in instead of sending their whole information
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some internal error occured");
    }
  }
);

// route 2: Authenticate a User using : POST "/api/auth/login"  and also doesn't require auth. where createUser is in api/auth
// Here only email and password is check and if not coreect email or for empty password error massage is send and also server is not triggered and when everything is correct then we check email and password available in database or not
router.post(
  "/login",
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Password should not empty").exists(),
  ],
  async (req, res) => {
    let success = false; // deciding variable is added for future use ( it show success or not in each response)
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ success, errors: "Invalid request result.array()" });
    }

    const { email, password } = req.body; // destructuring email and password from req.body

    try {
      let user = await User.findOne({ email }); // find if user is availabe or not in database
      if (!user) {
        console.log("User unavailable");
        return res
          .status(400)
          .send({ success, error: "Email or password not correct" });
      }

      const passwordCmp = await bcrypt.compare(password, user.password); // bcript method to check password matched to the password in database for given user
      if (!passwordCmp) {
        console.log("User unavailable");
        return res
          .status(400)
          .send({ success, error: "Email or password not correct" });
      }
      console.log("User available");
      success = true;
      // when user is with correct password and email in database then we send him a json token
      const token = jwt.sign({ id: user.id }, JWT_SECRET); // sign method is used to create token, first paramete is object and second parameter is signatue which is a secrete.
      return res.send({ success, token }); // we send token to who signed in instead of sending their whole information
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some internal error occured");
    }
  }
);

// route 3: Get login user detail using : POST "/api/auth/getUser"  and also require login
// Here we are sending a middleware named fetchUser which gave the user id from the token from request header
// No need to pass any checking middleware which checks whar input entered in request
router.post("/getUser", fetchUser, async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() });
  }

  try {
    const userId = req.user; // as we directly got id from middleware in req so set that id as userId
    const user = await User.findOne({ _id: userId }).select("-password"); // when we get userId first find _id from User database using findOne and then select information (except password) from that user;
    return res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some internal error occured");
  }
});

module.exports = router;
