module.exports = {
  findTwitterTopic : function(topic, twitterContent) {
    topic = topic.toLowerCase();
    twitterContent = twitterContent.toLowerCase();

    // Removes all punctionation and whitespace from string
    var removedPunctuation = twitterContent.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    removedPunctuation = removedPunctuation.replace(/\s{2,}/g," ");
    removedPunctuation = removedPunctuation.replace(/\s/g, '')
    //once punctuation is removed, splitting will return an array of words
    var pattern = new RegExp(topic, 'g')
    if(removedPunctuation.match(pattern)){
      console.log('true for text')
      return true;
    }
    //looking for the topic in the array


    return false;
  },

  findHashTag : function(topic, tagArray) {
    topic = topic.toLowerCase();

    for(var i =0;i<tagArray.length;i++){
      var parsed = tagArray[i].text.toLowerCase();

    // Removes all punctionation and whitespace from string
      parsed = parsed.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");

      parsed = parsed.replace(/\s{2,}/g," ");
      var pattern = new RegExp(topic, 'g')
      if(parsed.match(pattern)){
        console.log('true for hash')
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
