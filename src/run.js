'use strict';

const homeWorld = 'Sea of Sorrows';
const defaultGroup = 'Verified';

const linkedWorlds = [
  "Devona's Rest"
];

const linkedGroup = 'Linked';

const Client = require('node-rest-client').Client;
const Bot = require('cmr1-ts3-bot');
const async = require('async');
const msgs = require('./msgs');

const api = new Client();

const base = 'https://api.guildwars2.com/v2';

api.registerMethod('getWorlds', base + '/worlds', 'GET');
api.registerMethod('getAccount', base + '/account', 'GET');
api.registerMethod('getGuild', base + '/guild/${id}', 'GET');

function lookupGw2Info(apiKey, callback) {
  const apiArgs = {
    headers: {
      Authorization: 'Bearer ' + apiKey
    }
  };

  const response = {};

  api.methods.getAccount(apiArgs, (data, resp) => {
    if (!data.id || !data.world) {
      return callback('Invalid Account/ApiKey');
    }

    response.account = data;

    api.methods.getWorlds({ parameters: { ids: data.world }}, (data, resp) => {
      if (data.length === 0 || !data[0].id || !data[0].name) {
        return callback('Invalid World');
      }

      response.world = data[0];
      response.guilds = [];

      async.each(response.account.guilds, (id, next) => {
        api.methods.getGuild({ path: { id }}, (data, resp) => {
          response.guilds.push(data);

          next();
        });
      }, err => {
        return callback(err, response);
      });
    });
  });
}

const bot = new Bot();

bot.init();

bot.on('ready', () => {
  bot.server.message(`Ready for service.`);
});

bot.on('join', channel => {
  channel.message(msgs.welcome + msgs.hint);
});

bot.on('cliententerchannel', context => {
  context.channel.message(msgs.welcome + msgs.hint);
  context.client.message(`Hi ${context.client.client_nickname}! My name is ${bot.options.name}, I can help verify your GuildWars2 account information and automatically add you to the appropriate TeamSpeak group(s)!\n${msgs.hint}`);
});

bot.globalCommand('help', (args, context) => {
  context.client.message(msgs.help);
});

bot.globalCommand('woodhouse', (args, context) => {
  context.client.message(msgs.help);
});

bot.globalCommand('verifyme', (args, context) => {
  context.client.message(msgs.help);
});

bot.privateCommand('apikey', (args, context) => {
  context.client.message('Thanks! Let me look up your account information...');

  lookupGw2Info(args[1], (err, resp) => {
    if (err) {
      context.client.message(`I'm sorry, I have encountered an error: ${err}`);
    } else {
      async.concat(resp.guilds.map(g => g.tag), (group, next) => {
        context.client.addToServerGroup(group, (err) => {
          if (err && err.error_id && err.error_id === 2561) {
            next(null, group);
          } else if (err) {
            bot.logger.debug(err);
            next();
          } else {
            next(null, group);            
          }
        });
      }, (err, groups) => {
        if (err) {
          context.client.message(`I'm sorry, I have encountered an error: ${err}`);         
        } else if (groups && groups.length > 0) {
          context.client.message(`You are a member of the group(s): ${groups}`);
        } else if (resp.world.name === homeWorld) {
          context.client.addToServerGroup(defaultGroup, err => {
            if (err) bot.logger.warn(err);
            else context.client.message(`You have been added to the group: ${defaultGroup}`);
          });
        } else if (linkedWorlds.indexOf(resp.world.name) !== -1) {
          context.client.addToServerGroup(linkedGroup, err => {
            if (err) bot.logger.warn(err);
            else context.client.message(`You have been added to the group: ${linkedGroup}`);
          });
        } else {
          context.client.message(`I'm sorry, but automatic verification is not currently enabled for ${resp.world.name}.`);
        }
      });
    }
  });
});