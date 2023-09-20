// We register the user, hash his password and save it in the login table 
// we also add his/her details in the users table with the email, name and joining date

const handleRegister = (req, res, db, bcrypt) => { 
    const { email, name, password } = req.body;
    if (!email || !name || !password){
      return res.status(400).json('incorrect submission')
    }
    const hash = bcrypt.hashSync(password);
    // Transaction helps to update two tables at a time and if either fails the whole "transaction" fails 
    // In this case we are entering values both into the login and users table.
    // The login table has the hash form of password and the email of the user
      db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0].email,
              name: name,
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('unable to register'))
  }

module.exports = {
    handleRegister: handleRegister
}