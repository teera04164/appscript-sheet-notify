function myFunction() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Youtube")
  const lastRow = sheet.getLastRow();
  for (let row = 2; row <= lastRow; row++) {
    const name = sheet.getRange(`A${row}`).getValue();
    const monthPay = sheet.getRange(`B${row}`).getValue();
    checkAlertUser(name, monthPay)
  }
}

const monthTh = ["","มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",]


function checkAlertUser(name, monthPay){
  const currentTime = new Date()
  const currentDate = currentTime.getDate()
  const currentYear = currentTime.getFullYear() + 543
  const currentMonth = currentTime.getMonth()+1
  const [payMonth, payYear] = monthPay.split('-')
  const lastDayOfMonth = getLastDayOfMonFnc()
  const equeDay = (currentDate == lastDayOfMonth)
  const equeMonth = (+payMonth == currentMonth)
  const equeYear = (+payYear == currentYear)
  const isAlertPay = (equeDay && equeMonth  && equeYear)
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
