// create function isExpired to check whether the ordertime is over alter order time limit
let register = function(Handlebars) {
    let helpers = {
        isExpired: function (updateTime, timeLimit) { 
            let now = new Date();
            let updatetime = new Date(updateTime);
            let timeStamp = parseInt(timeLimit);
        
            let dist = now - updatetime;
            // if over the timestamp, return false
            if ((dist / 1000) / 60 > timeStamp) {
                return false;
            }
            return true;
        },
    };
  
    if (Handlebars && typeof Handlebars.registerHelper === "function") {
      // register helpers
      for (var prop in helpers) {
          // register helper using the registerHelper method
          Handlebars.registerHelper(prop, helpers[prop]);
      }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }
  
  };


  // export helpers to be used in our express app
  module.exports.register = register;
  module.exports.helpers = register(null);
