'use strict';

const async = require('async');
const Client = require('node-rest-client').Client;

const api = new Client();
const base = 'https://api.guildwars2.com/v2';

api.registerMethod('getWorlds', base + '/worlds', 'GET');
api.registerMethod('getAccount', base + '/account', 'GET');
api.registerMethod('getGuild', base + '/guild/${id}', 'GET');

module.exports.lookup = (apiKey, callback) => {
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
};