function find_deadline(date, type) {
  // 入力は今日もしくは昨日の日付<yyyy/mm/dd>
  // 出力は締め切りが今日、もしくは明日である計画の番号の配列<int>
  
  var schedule_datasheet = SpreadsheetApp.openById('1B9Jj7-LUafTe1_rlI3U2nM2v9Reh7RdgmmE9Pf8_rxo').getSheetByName('data');
  var last_number = schedule_datasheet.getLastRow();
  
  var output_number_list = [];
  for (i=2;i<=last_number;i++) {
    if (type == "deadline") {
      var dead_line = schedule_datasheet.getRange(i, 6).getValue();
    } else if (type == "event_date") {
      var dead_line = schedule_datasheet.getRange(i, 7).getValue();
      if (dead_line == "") {
        continue
      }
    } else {
      Logger.log("deadline error");
    }
    
    dead_line = Utilities.formatDate(dead_line, 'Asia/Tokyo', 'yyyy/MM/dd');
    //dead_line = Moment.moment(dead_line);
    if (type == "deadline") {
      Logger.log("dead_line_"+(i-1)+"_"+dead_line);
    } else if (type == "event_date") {
      Logger.log("event_date_"+(i-1)+"_"+dead_line);
    } else {
      Logger.log("deadline error");
    }
    //var date_moment = Moment.moment(date);
    //Logger.log("data_moment:"+date_moment);
    if (Moment.moment(dead_line).isSame(date, 'day')) {
      var num_str = String(i-1);
      output_number_list.push(num_str);
    }
  }
  Logger.log(output_number_list)
  return output_number_list
}

function exect_find_deadline() {
  // make today and tomorrow string
  var today = new Date();
  //var today = new Date("2018/06/15");
  var today_str = Utilities.formatDate(today, 'Asia/Tokyo', 'yyyy/MM/dd');
  
  var tomorrow = new Date(today.getYear(), today.getMonth(), today.getDate() + 1);
  //var tomorrow = new Date("2018/06/09");
  var tomorrow_str = Utilities.formatDate(tomorrow, 'Asia/Tokyo', 'yyyy/MM/dd');
  
  Logger.log('today:'+today_str);
  Logger.log('tomorrow:'+tomorrow_str);
  
  // find tomorrow deadline
  var tomorrow_list = find_deadline(tomorrow, "deadline");
  Logger.log("tomorrow_list: " + tomorrow_list);
  
  if (tomorrow_list.length==0){
    Logger.log("tomorrow_list.length = 0");
  }else {
    for(i=0;i<tomorrow_list.length;i++){
      var tomorrow_num = tomorrow_list[i];
      var plan_info = get_plan_info(tomorrow_num);
      var plan_name = plan_info["plan_name"];
      
      var schedule_url = "https://script.google.com/macros/s/AKfycbzGwsn2XHNP5Pt2A3q9_rGy0pTJR06eLqeG3lT9Th5kuNmFwYc/exec?schedule_number="+tomorrow_num+"&detail=-1&openExternalBrowser=1";
      var message = "「" + plan_name + "」 の締め切りが迫ってるねぇ！" + String.fromCharCode(10) +　String.fromCharCode(10) +
                    "回答してない YOBBO は回答してくれよい！！" + String.fromCharCode(10) + String.fromCharCode(10) +
                    "DIE YOBBO!!" + String.fromCharCode(10) + String.fromCharCode(10) +
                    schedule_url;
      Logger.log("msg_"+i+":"+message);
      //sendHttpPost(message);
    }
  }
  
  // find today deadline
  var today_list = find_deadline(today, "deadline");
  Logger.log("today_list: " + today_list);
  
  if (today_list.length==0){
    Logger.log("today_list.length = 0");
  } else {
    for(i=0;i<today_list.length;i++){
      var today_num = today_list[i];
      var plan_info = get_plan_info(today_num);
      var plan_name = plan_info["plan_name"];
      
      var event_info = get_event_info(today_num);
      var event_date = event_info["event_date"];
      event_date = plan_info["candidate_date" + event_date];
      var players = event_info["players_name"];
      players = players.join("," + String.fromCharCode(10))
      
      var message = "「" + plan_name + "」 の開催日が決まったようだねぇ！！" + String.fromCharCode(10) +
                    "開催日は " + event_date + " になりそうだねぇ！！！"+ String.fromCharCode(10) + String.fromCharCode(10) +
                    "参加者は" + String.fromCharCode(10) +
                    players + String.fromCharCode(10) + "だねぇ！！" + String.fromCharCode(10) + String.fromCharCode(10) +
                    "よろしくだねぇ！！！";
      Logger.log("msg_"+i+":"+message);
      
      //sendHttpPost(message);
      
      // put event date in sheet
      var datasheet_schedule = SpreadsheetApp.openById("1B9Jj7-LUafTe1_rlI3U2nM2v9Reh7RdgmmE9Pf8_rxo").getSheetByName("data");
      datasheet_schedule.getRange(Number(today_num)+1, 7).setValue(event_date);
    }
  }
  
  // find tomorrow event date
  var tomorrow_event_list = find_deadline(tomorrow, "event_date");
  Logger.log("tomorrow_event_list: " + tomorrow_event_list);

  if (tomorrow_event_list.length==0){
    Logger.log("tomorrow_event_list.length = 0");
  } else {
    for(i=0;i<tomorrow_event_list.length;i++){
      // to do
      var tomorrow_event_num = tomorrow_event_list[i];
      var plan_info = get_plan_info(tomorrow_event_num);
      var plan_name = plan_info["plan_name"];
      var message = "「" + plan_name + "」が明日開催されるようだねぇ!!" + String.fromCharCode(10) +
                    "なぁんでって、そりゃぁそぉだろおよぉぉおおおお！！！！";
      Logger.log("msg_"+i+":"+message);
      
      //sendHttpPost(message);

    }
  }
}

function get_plan_info(plan_number) {
  plan_number = Number(plan_number);
  
  var output = {};
  // 計画
  var datasheet_plan = SpreadsheetApp.openById('1E2VMlYvO-8XFrT9nI7xKI5TNWTvUlJtuOavnwtoO-FI').getSheetByName('data');
  Logger.log("plan_number: "+plan_number);
  output["plan_name"] = datasheet_plan.getRange(plan_number+1, 2).getValue();
  
  // スケジュール
  var datasheet_schedule = SpreadsheetApp.openById("1B9Jj7-LUafTe1_rlI3U2nM2v9Reh7RdgmmE9Pf8_rxo").getSheetByName('data');
  var candidate_date1 = datasheet_schedule.getRange(plan_number+1, 3).getValue();
  var candidate_date2 = datasheet_schedule.getRange(plan_number+1, 4).getValue();
  var candidate_date3 = datasheet_schedule.getRange(plan_number+1, 5).getValue();
  
  output["candidate_date1"] = Utilities.formatDate(candidate_date1, 'Asia/Tokyo', 'yyyy/MM/dd');
  output["candidate_date2"] = Utilities.formatDate(candidate_date2, 'Asia/Tokyo', 'yyyy/MM/dd');
  output["candidate_date3"] = Utilities.formatDate(candidate_date3, 'Asia/Tokyo', 'yyyy/MM/dd');
  return output
}

function get_event_info(plan_number) {
  plan_number = Number(plan_number);
  
  var output = {};
  
  // 参加者のリストを取得
  var datasheet_player = SpreadsheetApp.openById("1E2VMlYvO-8XFrT9nI7xKI5TNWTvUlJtuOavnwtoO-FI").getSheetByName("user_master");
  var player_number = datasheet_player.getLastRow() - 1;
  Logger.log("player_number: " + player_number);

  // 参加者の出席状況の取得
  var datasheet_schedule = SpreadsheetApp.openById("1B9Jj7-LUafTe1_rlI3U2nM2v9Reh7RdgmmE9Pf8_rxo").getSheetByName("ditail_data");
  Logger.log("plan_number + 1: " + (plan_number + 1));
  Logger.log("player_number + 1: " + (player_number + 1));
  
  var arr_schedule = datasheet_schedule.getRange(plan_number + 1, 1, 1, player_number + 1).getValues();
  Logger.log("arr_schedule:" + arr_schedule);
  
  var day1_status_sum = 0;
  var day2_status_sum = 0;
  var day3_status_sum = 0;
  var day1_member = [];
  var day2_member = [];
  var day3_member = [];
  for (i=1; i<=player_number;i++) {
    var status = arr_schedule[0][i];
    Logger.log("status_" + i + ":" + status);
    var status_list = status.split("-")
    Logger.log("status_list:" + status_list + String.fromCharCode(10) +
               "status_list[0]:" + status_list[0] + String.fromCharCode(10) +
               "status_list[1]:" + status_list[1] + String.fromCharCode(10) +
               "status_list[2]:" + status_list[2] + String.fromCharCode(10));
    day1_status_sum += Number(status_list[0]);
    day2_status_sum += Number(status_list[1]);
    day3_status_sum += Number(status_list[2]);
    if (Number(status_list[0]) != 0) {
      day1_member.push(i);
    }
    if (Number(status_list[1]) != 0) {
      day2_member.push(i);
    }
    if (Number(status_list[2]) != 0) {
      day3_member.push(i);
    }

  }
  
  Logger.log("day1_status_sum: " + day1_status_sum);
  Logger.log("day2_status_sum: " + day2_status_sum);
  Logger.log("day3_status_sum: " + day3_status_sum);
  Logger.log("day1_member: " + day1_member);
  Logger.log("day2_member: " + day2_member);
  Logger.log("day3_member: " + day3_member);
  
  if (day1_status_sum < day2_status_sum) {
    output["event_date"] = "2";
  } else {
    if (day1_status_sum < day3_status_sum) {
      output["event_date"] = "3";
    } else {
      output["event_date"] = "1";
    }
  }

  if (output["event_date"] == "1") {
    output["players_number"] = day1_member;
  } else if (output["event_date"] == "2") {
    output["players_number"] = day2_member;
  } else if (output["event_date"] == "3") {
    output["players_number"] = day3_member;
  } else {
    output["players_number"] = "event date error";
  }
  
  Logger.log("output[players_number]: " + output["players_number"]);
  
  var players = [];
  for (i=0;i<output["players_number"].length;i++) {
    var player_number = output["players_number"][i];
    var player_name = datasheet_player.getRange(player_number + 1, 2).getValue();
    Logger.log("players_name: " + player_name);
    players.push(player_name)
  }
  output["players_name"] = players
  return output
}