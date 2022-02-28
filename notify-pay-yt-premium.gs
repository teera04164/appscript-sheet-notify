function myFunction() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Youtube")
  var lastRow = sheet.getLastRow();
  for (let row = 2; row <= lastRow; row++) {
    let name = sheet.getRange(`A${row}`).getValue();
    let monthPay = sheet.getRange(`B${row}`).getValue();
    checkAlertUser(name, monthPay)
  }
}

const monthTh = ["","มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",]


function checkAlertUser(name, monthPay){
  let currentTime = new Date()
  let currentDate = currentTime.getDate()
  let currentYear = currentTime.getFullYear() + 543
  let currentMonth = currentTime.getMonth()+1
  let [payMonth, payYear] = monthPay.split('-')
  let lastDayOfMonth = getLastDayOfMonFnc()
  let equeDay = (currentDate == lastDayOfMonth)
  let equeMonth = (+payMonth == currentMonth)
  let equeYear = (+payYear == currentYear)
  let isAlertPay = (equeDay && equeMonth  && equeYear)
  if(isAlertPay){
    console.log("current => ",currentDate,currentMonth, currentYear)
    console.log("pay => ", payMonth, payYear)
    sendMessageToLineNotify(`🚀แจ้งเตือน ${name} ครบรอบจ่ายเงินเดือน ${monthTh[+payMonth]} ${payYear} ครับ`)
  }
}

function getLastDayOfMonFnc(month =( new Date().getMonth()+1)) {
  return new Date(new Date(new Date().setMonth(month)).setDate(0)).getDate();
}


function sendMessageToLineNotify(message) {
  const lineNotifyEndPoint = "https://notify-api.line.me/api/notify";
  const accesssToken = "TOKEN" // bot group 
  const options = {
    "method": "POST",
    "headers": {
      "Authorization": "Bearer " + accesssToken,
      "Content-Type": "	application/x-www-form-urlencoded"
    },
    "payload": {
      "message": message
    },
  };

  try {
    UrlFetchApp.fetch(lineNotifyEndPoint, options);
    Logger.log("Send Notify Completed!");
  } catch (error) {
    Logger.log(error.name + "：" + error.message);
    return;
  };
}
