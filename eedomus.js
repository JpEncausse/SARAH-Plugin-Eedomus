var moment = require('moment');
moment.lang('fr');
    
exports.action = function(data, callback, config, SARAH){

  // CONFIG
  config = config.modules.eedomus;
  if (!config.api_ip || !config.api_user || !config.api_secret){
    console.log("Missing Eedomus config");
    return;
  } 

  // SET
  if (data.periphValue == undefined){
    get(data, callback, config, SARAH);
  } 
  else {
    set(data, callback, config, SARAH);
  }
}

// ==========================================
//  GET
// ==========================================

var get = function(data, callback, config, SARAH){ 

  // Build URL api.eedomus.com
  var ip  = config.api_ip
  var url = 'http://api.eedomus.com/get?action=periph.caract';
  url += '&api_user='+config.api_user;
  url += '&api_secret='+config.api_secret;
  url += '&periph_id='+data.periphId;
  
  // Send Request
  var request = require('request');
  request({ 'uri': url, 'json': true }, function (err, response, json){
    
    if (err || response.statusCode != 200) {
      callback({'tts': "L'action a échoué"});
      return;
    }
    
    // Get JSON Body
    json = json.body;

    // Callback with TTS
    var date = moment(json.last_value_change).format("HH:mm");
    var tts = json.name + ': ' + json.last_value + ' à ' + date;

    callback({ 'tts': tts, 'json': json });
  });

}

// ==========================================
//  SET
// ==========================================

var set = function(data, callback, config, SARAH){

  // Build URL api.eedomus.com
  var ip  = config.api_ip
  var url = 'http://'+ip+'/set?action=periph.value';
  url += '&api_user='+config.api_user;
  url += '&api_secret='+config.api_secret;
  url += '&periph_id='+data.periphId;
  url += '&value='+data.periphValue;
  
  // Send Request
  var request = require('request');
  request({ 'uri': url, 'json': true }, function (err, response, json){
    
    if (err || response.statusCode != 200) {
      callback({'tts': "L'action a échoué"});
      return;
    }
    
    // Callback with TTS
    var answers = config.answers.split('|');
    var answer = answers[ Math.floor(Math.random() * answers.length)];
    callback({'tts': answer});
  });

}

