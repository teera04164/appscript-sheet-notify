// config
const sheetId = "1FWJBJiEzUVcWYBZbWUINuiOxG-4QI";
const channelAcessToken = "0Z6EQOeXsOXVzIaLCX/Rk3OshfbVz4x3hfI7X+P3rIW82HH8BtFUZGMMq37XsL9fukAQdB04t89/1O/w1cDnyilFU="
const selectSheet = 'ชีต1'


const sheet = SpreadsheetApp.openById(sheetId);
Logger = BetterLog.useSpreadsheet(sheetId);

const nameRowCol = {
  miw: 'C2',
  milk: 'C3',
  dan: 'C4',
  tink: 'C5',
}

function doPost(e) {

  const requestJSON = e.postData.contents;
  Logger.log(requestJSON);
  const requestObj = JSON.parse(requestJSON);
  const userObject = requestObj.events[0]
  const userMessage = userObject.message.text;
  Logger.log("message => " + userMessage);

  const replyToken = userObject.replyToken;

  const command = userMessage.trim().split(" ")
  const commandWord = ['update', 'show']
  if (command.length && commandWord.includes(command[0])) {
    const [action, name, datePay] = command
    if (action === 'update') {
      return updateRow(name, datePay, replyToken)
    }

    if (action == 'show' && name == 'list') {
      return showAllNextPay(replyToken)
    }
  }
}

function updateRow(keyName, datePay, replyToken) {
  const sheetData1 = sheet.getSheetByName(selectSheet);
  const getRow = nameRowCol[keyName] || null

  if (!getRow) {
    return replyMessage(replyToken, [`❌ ไม่พบข้อมูลของ ${keyName}`]);
  }

  let lastPay = sheetData1.getRange(getRow).getValue();
  if (lastPay) {
    sheetData1.getRange(getRow).setValue(datePay)
    replyMessage(replyToken, [`✅ อัพเดท ${keyName} สำเร็จ `, `รอบที่เเล้ว ${lastPay}`, `รอบถัดไป ${datePay}`]);
  } else {
    replyMessage(replyToken, [`❌ ไม่การจ่ายเงิน ${keyName}`]);
  }
}

function showAllNextPay(replyToken) {
  const sheetData1 = sheet.getSheetByName(selectSheet)
  const lastRow = sheetData1.getLastRow();
  let payList = []
  for (let row = 2; row <= lastRow; row++) {
    let name = sheetData1.getRange(`A${row}`).getValue();
    let monthPay = sheetData1.getRange(`C${row}`).getValue();
    payList.push(`${name} next pay ${monthPay}`)
  }
  if (payList.length) {
    replyMessage(replyToken, [payList.join('\n')]);
  }
  return payList
}

// Reply message to Line
function replyMessage(replyToken, replyText = []) {
  Logger.log("in replyMessage replyToken=" + replyToken);
  const url = "https://api.line.me/v2/bot/message/reply";
  const lineHeader = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + channelAcessToken
  };

  const messages = replyText.map(ele => ({
    "type": "text",
    "text": ele
  }))

  const postData = {
    replyToken,
    messages
  };

  const options = {
    "method": "POST",
    "headers": lineHeader,
    "payload": JSON.stringify(postData)
  };
  let response
  try {
    response = UrlFetchApp.fetch(url, options);
  } catch (error) {
    Logger.log(error.name + "：" + error.message);
    return;
  }

  if (response && response.getResponseCode() === 200) {
    Logger.log("Sending message completed.");
  }
}
