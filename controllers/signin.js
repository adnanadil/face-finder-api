// so this like a function that call another function, so the function runs with db, bcrypt and then
// it calls the next function with req and res it is just another way to write a function in ES
// or we can resort to declaring it as the register function and calling it so.
const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect submission");
  }
  // Validating the email and passwords match since the password is saved as hash in the
  // db for safety he have to compare it with the received password and bcrypt library's compareSync
  // function is used.
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
};

module.exports = {
  handleSignin,
};
