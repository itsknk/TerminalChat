const express = require('express');
const bodyParser = require('body-parser');
const cors  = require('cors');
const Chatkit = require('@pusher/chatkit-server');

const app = express();

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:72f69090-97ec-429c-8c72-bb1c88c4f83b',
  key: '34c42097-2b90-4162-958a-92a7f0a15d18:ikJSBuFlkI8/a8efyVU7L82E5Mh7Hk/9yiPPXErtPgk='
});

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.post('/users', (req,res) => {
  const {username}  = req.body
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => {
      console.log(`User Created: ${username}`)
      res.sendStatus(201)
    })
    .catch(err => {
      if(err.error === 'services/chatkit/user_already_exists') {
        console.log(`User Already Exists: ${username}`)
        res.sendStatus(200)
      }
      else {
        res.status(err.status).json(err)
      }
    })
})

app.post('/authenticate', (req,res) => {
  const authData = chatkit.authenticate({userId: req.query.user_id})
  res.status(authData.status).send(authData.body)
})

const port = 3001;
app.listen(port, err => {
  if(err){
    conosle.log(err);
  }
  else{
    console.log(`Running on port ${port}`);
  }
})
