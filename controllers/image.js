// This is an important part of the project as we are making use of the Clarifai to detect
// faces in the image sent from the front end.

const Clarifai = require("clarifai");

// Best to use this api in the backend as we are able to hide the apiKey is ti was in the
// frontend there is a chance of it being exposed

const app = new Clarifai.App({
  apiKey: "b94ed38e5581485993d2a6a6e811bbf7",
});

const handleImageApiCall = (req, res) => {
  app.models
    .predict(
      // The Face Detect Mode: https://www.clarifai.com/models/face-detection can be found in the link
      // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
      // is to use a different version of their model that works like: `c0c0ac362b03416da06ab3fa36fb58e3`
      // so you would change from:
      // .predict(Clarifai.FACE_DETECT_MODEL, req.body.imageURL)
      // to:
      // .predict('c0c0ac362b03416da06ab3fa36fb58e3', req.body.imageURL)
      Clarifai.FACE_DETECT_MODEL,
      req.body.imageURL
    )
    .then((response) => {
      if (response) {
        res.json(response);
        console.log("Adnan", response);
      }
    })
    .catch((err) => console.log(err));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleImageApiCall,
};
