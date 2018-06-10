function sendHttpPost(message){
  var token = ["jzB7BB2Dv4YV8V2YnhlgBo3y7WzwrjXfY4HGL32gnT3"];
  var options =
   {
     "method"  : "post",
     "payload" : "message=" + message,
     "headers" : {"Authorization" : "Bearer "+ token}

   };

   UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}

function myFunction() {
  var message="Google App Srciptから送信" ;
  sendHttpPost(message);
}

function doPost(e) {
  var user_name = e.parameter.user_name;
  var plan_name = e.parameter.plan_name;
  var candidate_date1 = e.parameter.candidate_date1;
  var candidate_date2 = e.parameter.candidate_date2;
  var candidate_date3 = e.parameter.candidate_date3;
  var dead_line = e.parameter.dead_line;
  
  var message = user_name + " が " + plan_name + " を計画したぜぇ！" + String.fromCharCode(10)　+
  "候補日は, " + String.fromCharCode(10) + 
  "1. " + candidate_date1 + String.fromCharCode(10) + 
  "2. " + candidate_date2 + String.fromCharCode(10) +
  "3. " + candidate_date3 + "だねぇ！\n" +
  "締切日は" + dead_line + "っちゅうことかい？"
  sendHttpPost(message);
  
  payload = JSON.stringify({"response": "200"})
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(payload);
  return output
}
