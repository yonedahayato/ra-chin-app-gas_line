function sendHttpPost(message){
  var token = ["jzB7BB2Dv4YV8V2YnhlgBo3y7WzwrjXfY4HGL32gnT3"];
  var options =
    {
      "method"  : "post",
      "payload" : {
        "message": message
        },
      "headers" : {
        "Authorization" : "Bearer "+ token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
  Logger.log(options)

  UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}

function myFunction() {
  var message="Google App Scriptから送信" ;
  Logger.log(message)
  sendHttpPost(message);
}

function doPost(e) {
  var message_type = e.parameter.message_type;
  if (message_type == "plan") {
    var user_name = e.parameter.user_name;
    var plan_name = e.parameter.plan_name;
    var plan_number = String(e.parameter.plan_number);
    
    var candidate_date1 = e.parameter.candidate_date1;
    var candidate_date2 = e.parameter.candidate_date2;
    var candidate_date3 = e.parameter.candidate_date3;
    var dead_line = e.parameter.dead_line;
    
    var schedule_url = "https://script.google.com/macros/s/AKfycbzGwsn2XHNP5Pt2A3q9_rGy0pTJR06eLqeG3lT9Th5kuNmFwYc/exec?schedule_number="+plan_number+"&detail=-1&openExternalBrowser=1";
    Logger.log(schedule_url)
    
    var message = "「" + user_name + "」 が " + String.fromCharCode(10) +
      "「" + plan_name + "」 を計画したぜぇ！" + String.fromCharCode(10)　+ String.fromCharCode(10) +
      "候補日は, " + String.fromCharCode(10) + 
      "1. " + candidate_date1 + String.fromCharCode(10) + 
      "2. " + candidate_date2 + String.fromCharCode(10) +
      "3. " + candidate_date3 + "だねぇ！" + String.fromCharCode(10) + String.fromCharCode(10) +
      "締切日は" + dead_line + "っちゅうことかい？" + String.fromCharCode(10) + String.fromCharCode(10) +
      "下のurlから出席の回答をしてくれよい！" + String.fromCharCode(10) + String.fromCharCode(10) +
      schedule_url;
  } else if(message_type == "schedule") {
    var user_name = e.parameter.user_name;
    var plan_name = e.parameter.plan_name;
    var plan_number = e.parameter.plan_number;
    
    var candidate_date1 = e.parameter.candidate_date1;
    var candidate_date2 = e.parameter.candidate_date2;
    var candidate_date3 = e.parameter.candidate_date3;
    
    //candidate_date1 = Utilities.formatDate(candidate_date1, 'Asia/Tokyo', 'yyyy/MM/dd')
    var status = e.parameter.status;
    var answer_info = get_schedule_answer_msg(status);

    var message = "「" + user_name + "」 が " + String.fromCharCode(10)　+
      "「" + plan_name + "」 に回答したようだねぇ!" + String.fromCharCode(10)　+ String.fromCharCode(10) +
      "1. " + candidate_date1 + answer_info["msg1"] + String.fromCharCode(10) +
      "2. " + candidate_date2 + answer_info["msg2"] + String.fromCharCode(10) +
      "3. " + candidate_date3 + answer_info["msg3"] + String.fromCharCode(10) + String.fromCharCode(10) +
      "っちゅうことになるね";
  } else {
    var message = "[doPost]: line send error";
  }
  Logger.log(message)

  sendHttpPost(message);
  
  payload = JSON.stringify({"response": "200"})
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(payload);
  return output
}

function get_schedule_answer_msg(status) {
  var good_msg = " は、ベネだねぇ！！";
  var soso_msg = " は、、ほうほうだねぇ";
  var bad_msg = " は、ちと、、、だねぇ";
  var output_list = {};
  
  var status_list = status.split("-");
  
  for (i=0;i<status_list.length;i++) {
    var number = i + 1;
    if (status_list[i] == "2") {
      output_list["msg"+number] = good_msg;
    } else if(status_list[i] == "1") {
      output_list["msg"+number] = soso_msg;
    } else if(status_list[i] == "0"){
      output_list["msg"+number] = bad_msg;
    }
  }
  
  return output_list
}