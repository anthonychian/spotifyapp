const express = require('express')
const cors = require('cors')
const spotifyWebApi = require('spotify-web-api-node')

const app = express()
const port = 8000

app.use(cors()) // To handle cross-origin requests

app.use(express.json()); // To parse JSON bodies

require('dotenv').config()

const credentials = {
  clientId: process.env.REACT_APP_CLIENT_ID,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  redirectUri: process.env.REACT_APP_REDIRECT_URI,
};

app.listen(port,  () => {
    console.log(`Listening on port ${port}`)
})

app.get('/', (req, res) => {

})

app.post('/login', (req,res) => {
//  setup 
    let spotifyApi = new spotifyWebApi(credentials)

//  Get the "code" value posted from the client-side and get the user's accessToken from the spotify api     
    const code = req.body.code

    // Retrieve an access token
    spotifyApi.authorizationCodeGrant(code).then((data) => {

        // Returning the User's AccessToken in the json formate  
        res.json({
            accessToken : data.body.access_token,
        }) 
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(400)
    })

})