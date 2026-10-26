const express = require("express");
const {signupSchema, loginSchema} = require("../validation.js")
const pool = require("../db")
const bcrypt = require("bcrypt")

const router = express.Router();

router.post("/signup", async(req, res, next) => {
  const result = signupSchema.safeParse(req.body);

  // If it failed, return status 400 with a JSON error.
  if(result.success === false){
    return res.status(400).json({
        error: 'Invalid signup info'
   })
  }

  try{
   const user = await pool.query(
	"SELECT id FROM users WHERE email = $1",
	[result.data.email]
  )

if (user.rows.length > 0) {
  return res.status(409).json({
    error: "Email already in use"
  });
}

const passwordHash = await bcrypt.hash(result.data.password, 12);

const newUser = await pool.query(
  `INSERT INTO users (name, email, password_hash)
   VALUES ($1, $2, $3)
   RETURNING id, name, email`,
  [result.data.name, result.data.email, passwordHash]
);

return res.status(201).json({
  message: "Account created successfully",
  user: newUser.rows[0]
});

  } catch (err) {
    console.error(err);
    next(err);
  }
});


router.post("/login", async (req, res, next) => {
  // 1. Validate the request body
  const result = loginSchema.safeParse(req.body);

  if (result.success === false) {
    return res.status(400).json({
      error: "Invalid login info"
    });
  }

  try {
    // 2. Find the user by email
    const user = await pool.query(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE email = $1`,
      [result.data.email]
    );

    // 3. Reject unknown email addresses
    if (user.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    // 4. Get the matching user record
    const foundUser = user.rows[0];

    // 5. Compare the submitted password with the stored hash
    const comparedHash = await bcrypt.compare(
      result.data.password,
      foundUser.password_hash
    );

    // 6. Reject an incorrect password
    if (!comparedHash) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    // 7. Return safe user details
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email
      }
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
});


module.exports = router;
