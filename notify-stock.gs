
function checkNotify(input = 'ait', row = 2) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("หุ้นที่ต้องศึกษา")
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  for (let row = 2; row <= lastRow; row++) {
    let sym = sheet.getRange(`A${row}`).getValue();
    const response = UrlFetchApp.fetch("https://abc.herokuapp.com/scrap/net-profit?symbol=" + sym);
    const resp = (JSON.parse(response.getContentText()))
    const { assetName, currentPrice, marketCap, pe, oneYearReturn } = resp
    sheet.getRange(`D${row}`).setValue(resp.businesType);
    Logger.log(resp.netProfitAll)
  }

}


const notify = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("🔔แจ้งเตือนราคา")
  const lastRow = sheet.getLastRow();
  let notifyList = []
  for (let row = 2; row <= lastRow; row++) {
    let name = sheet.getRange(`A${row}`).getValue();
    let operate = sheet.getRange(`B${row}`).getValue();
    let price = sheet.getRange(`C${row}`).getValue();
    let isAlert = sheet.getRange(`D${row}`).getValue();
    let remark = sheet.getRange(`G${row}`).getValue();
    console.log(isAlert)
    notifyList.push({name, operate, price, isAlert: isAlert == 'เปิด', remark})
  }
  console.log(notifyList)
  makeHttpPost(notifyList)
}

const makeHttpPost = (payload) => {
  const options = {
    muteHttpExceptions: true,
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  }
  UrlFetchApp.fetch('https://abc.herokuapp.com/notify', options);
}

function getCurrentRow() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("หุ้นที่ต้องศึกษา")
  var currRow = sheet.getActiveRange().getA1Notation()
  Logger.log(currRow)
}

function reloadData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("ชีต14")
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  sheet.getRange(`D2:J${lastRow}`).clearContent()
  for (let row = 2; row <= lastRow; row++) {
    let sym = sheet.getRange(`A${row}`).getValue();
    const response = UrlFetchApp.fetch("https://abc.herokuapp.com/scrap/net-profit?symbol=" + sym);
    const resp = (JSON.parse(response.getContentText()))
    sheet.getRange(`D${row}`).setValue(resp.currentPrice)
    sheet.getRange(`E${row}`).setValue(resp.businesType)
    sheet.getRange(`F${row}`).setValue(resp["yield"])
    sheet.getRange(`G${row}`).setValue(resp.oneYearReturn)
    sheet.getRange(`H${row}`).setValue(resp.pe)
    sheet.getRange(`I${row}`).setValue(resp.pbv)
    sheet.getRange(`J${row}`).setValue(resp.netProfitAll)
  }
}

function getData(input = 'ait', field = 'businesType') {
  var response = UrlFetchApp.fetch("https://abc.herokuapp.com/scrap/net-profit?symbol=" + input);
  const resp = (JSON.parse(response.getContentText()))
  Logger.log(resp[field])
  return resp[field]
}

function clearCache() {
  var result = SpreadsheetApp.getUi().alert("ลบเเคชจะทำให้ช้าในครั้งเเรก ต้องการลบหรือไม่");
  if (result === SpreadsheetApp.getUi().Button.OK) {
    var response = UrlFetchApp.fetch("https://abc.herokuapp.com/reset");
    SpreadsheetApp.getActive().toast(response.getContentText());
  }

}

function ANALYS(input) {
  SpreadsheetApp.getActive().getSheetByName('analys').activate();
}

// function callNumbers(argA) {
// var ss = SpreadsheetApp.getActiveSpreadsheet() ;
// var sheet = ss.getSheetByName("AAB")getActiveCell
// sheet.activate() ;
// Logger.log(argA)
//  var response = UrlFetchApp.fetch("http://numbersapi.com/random/math");
//   var fact = response.getContentText();
//   sheet.getRange(1,1).setValue([fact]);
//   return 1
// }
