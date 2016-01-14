module.exports = {
  findTwitterTopic : function(topic, twitterContent) {
    topic = topic.toLowerCase();
    twitterContent = twitterContent.toLowerCase();
    // Removes all punctionation and whitespace from string
    var removedPunctuation = twitterContent.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    removedPunctuation = removedPunctuation.replace(/\s{2,}/g," ");
    //once punctuation is removed, splitting will return an array of words
    var twitterContentArray = removedPunctuation.split(' ');
    //looking for the topic in the array
    for(var i = 0; i < twitterContentArray.length; i++) {
      if (twitterContentArray[i] === topic) {
        return true;
      }
    }

    return false;
  },

  findHashTag : function(topic, tagArray) {
    topic = topic.toLowerCase();
    for(var i =0;i<tagArray.length;i++){
      var parsed = tagArray[i].text.toLowerCase();

    // Removes all punctionation and whitespace from string
      parsed = parsed.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");

      parsed = parsed.replace(/\s{2,}/g," ");

      if(topic.match(/parsed/)){
        return true;
      }
      // for(var j = 0;j<parsed.length;j++){
      //   if(parsed[i] === topic){

      //     return true;
      //   }
      // }
    }
    return false;
  }
};
