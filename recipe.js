const Discord = require("discord.js");
const client = new Discord.Client();
const cronJob = require("cron").CronJob;
const request = require("request");
const config = require("./conf/config.json");

// Client receive message event
client.on("message", receivedMessage => {
  if (receivedMessage.author == client.user) {
    // Prevent bot from responding to its own messages
    return;
  }

  if (receivedMessage.content.startsWith("$")) {
    processCommand(client, receivedMessage);
  }
});

// Start cronJob when bot is connected
client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  recipe_push(client);
  job.start();
});

// CronJob who will call recipe_push() every 6hours
const job = new cronJob("0 */6 * * *", function() {
  recipe_push(client);
});

// Request to marmiton a random recipe by getting redirect url and send it to a channel
function recipe_push(client) {
  var recipe = request.get(
    "https://www.marmiton.org/recettes/recette-hasard.aspx",
    function(err, res, body) {
      console.log(recipe.uri.href);
      client.channels.get(config.channel).send(recipe.uri.href); // Replace with known channel ID
    }
  );
}

function processCommand(client, receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
  let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1); // All other words are arguments/par  ameters/options for the command

  console.log("Command received: " + primaryCommand);
  console.log("Arguments: " + arguments); // There may not be any arguments

  switch (String(primaryCommand)) {
    case "rdm":
      recipe_push(client);
      break;
  }
}

// Login the bot with the discord server
client.login(config.token);
