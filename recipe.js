const Discord = require("discord.js");
const client = new Discord.Client();
const cronJob = require("cron").CronJob;
const request = require("request");
const config = require("./conf/config.json");

// Start cronJob when bot is connected
client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  job.start();
});

// CronJob who will call recipe_push() every 6hours
const job = new cronJob("* */6 * * *", function() {
  recipe_push();
});

// Request to marmiton a random recipe by getting redirect url and send it to a channel
function recipe_push() {
  var recipe = request.get(
    "https://www.marmiton.org/recettes/recette-hasard.aspx",
    function(err, res, body) {
      console.log(recipe.uri.href);
      client.channels.get(config.channel).send(recipe.uri.href); // Replace with known channel ID
    }
  );
}

// Login the bot with the discord server
client.login(config.token);
