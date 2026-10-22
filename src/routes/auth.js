const express = require("express");
const {signupSchema} = require("../validation.js")
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

  if(user.rows.length === 0){
   return res.status(200).json({message: "Email is available"})
  } else{
    return res.status(409).json({
	error: "Email already in use"
    })
  }

}catch(err){
     console.error(err);
     next(err);
  }
});

module.exports = router;
