// This helps in getting the user profile from the users app based on the id passed on my the 
// frontend 

const handleProfileGet = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
      .then(user => {
        if (user.length) {
          res.json(user[0])
        } else {
          res.status(400).json('Not found')
        }
      })
      .catch(err => res.status(400).json('error getting user'))
}

module.exports = {
    handleProfileGet
}