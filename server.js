// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'ce4de799a70b486eb606ba47d5c8c9b6',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

/*
Part 6: Deployment is done as well as possible. The instructions for Part 6: Deployment are incomplete. The Procfile is all that is needed to get the deployed site working properly, but more is needed to connect the deployed site on Heroku to Rollbar.

I tried setting up Heroku the way outlined in the intructions, a different way outlined below, by installing the npm package dotenv in case line 115 was not working properly (no change) and setting it up to use a .env file I created. 3 different methods, everything working on the deployed site just as well as when I was running it locally on server port 3000. HOWEVER, nothing on the deployed site is being updated to Rollbar. Tried swapping the access token above for the post_client_item token (currently using post_server_item tooken), but then Rollbar wasn't working at all.

In order to report deploys to Rollbar from my Heroku app, it is suggested to use the free Deploy Hook add-on from Heroku. While this is a free option, it will not allow me to do that on Heroku until I add a credit card. 
https://docs.rollbar.com/docs/heroku

I was able to find an example on how to perform an HTTP post to URL of your choice, with the example looking like it is in a terminal, but that does not work in VS Code / Node?
https://devcenter.heroku.com/articles/deploy-hooks

There is a section at this site on Project Access Tokens & Account Access Tokens
https://explorer.docs.rollbar.com/#section/Authentication/Project-access-tokens
*/

require("dotenv").config()
const express = require('express')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')

app.use(express.json())
app.use(express.static("public"));

app.get("/styles", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.css"));
});
app.get("/js", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.js"));
});

/* Huh. So we need the 2 app.get above because of how the index.html is set up. 
<link rel="stylesheet" href="/styles"> && <script src="/js"></script>

If those lines in index.html instead were:
<link rel="stylesheet" href="./index.css"> && <script src="./index.js"></script>

Then we would not need the 2 app.get because it would be able to properly access those files which are also located in the public folder. At least when hosting locally. But maybe that won't work when deployed, which is why the 2 app.get were recommended? UPDATE: Tested, works just as well using either method */

app.get('/api/robots', (req, res) => {
    rollbar.info("User clicked the See All Bots button")
    try {
        res.status(200).send(botsArr)
        rollbar.log("Was able to GET all bots")
    } catch (error) {
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
        rollbar.error(error)
    }
})

app.get('/api/robots/five', (req, res) => {
    rollbar.info("User clicked the Draw button")
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
        rollbar.log("Was able to GET five robots, shuffle the order, and display them")
    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
        rollbar.error(error)
    }
})

app.post('/api/duel', (req, res) => {
    rollbar.info("User clicked the DUEL! button")
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
            rollbar.log("Duel completed successfully - User lost the duel")
        } else {
            playerRecord.losses++
            res.status(200).send('You won!')
            rollbar.log("Duel completed successfully - User won the duel")
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        res.sendStatus(400)
        rollbar.error(error)
    }
})

app.get('/api/player', (req, res) => {
    rollbar.info("GET request for current win/loss record")
    try {
        res.status(200).send(playerRecord)
        rollbar.log("Was able to GET and display player's win/loss record")
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
        rollbar.error(error)
    }
})

const port = process.env.PORT || process.env.SERVER_PORT

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})