function doGet(e) {
  if (!e.parameter.number) {
    return HtmlService.createTemplateFromFile("plan").evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }else{
    var detail = HtmlService.createTemplateFromFile("plan_detail");

    if (e.parameter.number == -1) {
      var last_edit_number = calculate_LastEditNumber()
      detail.number = last_edit_number
     }else {
      var number = e.parameter.number;
      detail.number = number;
    }

    return detail.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }
  return HtmlService.createTemplateFromFile("plan_detail").evaluate();
}

function calculate_LastEditNumber(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var LastRow = sheet.getRange("A1:A").getLastRow();
  var indicateRow = calculateLastRow_down(sheet, LastRow, 1);

  var data = sheet.getRange(2, 1, indicateRow-1-1, 8).getValues();
  var sorted_data = ArrayLib.sort(data, 7-1, false)
  var LastEditNumber = sorted_data[0][7];
  return LastEditNumber
}

function insertNewInfo(button) {
  if(button != "True") {
    return
  }
  var sheet = SpreadsheetApp.getActiveSheet();
  var LastRow = sheet.getRange("A2:A").getLastRow();
  insertNum = calculateLastRow_down(sheet, LastRow, 1)
  
  arrData = [
    ["企画" + String(insertNum-1), "企画名", "タイプ", "スケジュール", "店", "集合場所", "-", insertNum-1, "-"]
  ];

  var rows = arrData.length;
  var cols = arrData[0].length;
  
  sheet.getRange(insertNum, 1, rows, cols).setValues(arrData)
}

function deleatNewInfo() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var LastRow = sheet.getRange("A1:A").getLastRow();
  deleatNum = calculateLastRow_down(sheet, LastRow, 1) - 1
  
  sheet.getRange(deleatNum, 1).clear();
}

function getScriptUrl() {
  var url = ScriptApp.getService().getUrl();
  return url;
}

function calculateLastRow_up(sheet, LastRow, col) {
  // col の最終行を計算する
  for(var i = LastRow; i>=1; i--) {
    if(sheet.getRange(i, col).getValue() != '') {
      var j = i + 1;
      return j
    }
  }
}

function calculateLastRow_down(sheet, LastRow, col) {
  for(var i = 1; i<=LastRow; i++) {
    if(sheet.getRange(i, col).getValue() == '') {
      return i
    }
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function updateRecord(number) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var now = new Date();
  var now_str = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  sheet.getRange(number+1, 7).clear()
  sheet.getRange(number+1, 7).setValue(now_str)
}