const {onRequest} = require("firebase-functions/v2/https");
const utils = require("./utils");

/* asynchronous "respone กลับไปได้ทันที ไม่ต้องรอrequest ก่อนหน้าเสร็จ" */
exports.webhook = onRequest(async (req, res) => {
  /* แกะ events ที่ถูกส่งมาจาก webhook */
  const events = req.body.events;
  for (const event of events) {
    /* เงื่อนไขที่1: ต้องเป็นข้อความ */
    if (event.type === "message" && event.message.type === "text") {
      const prompt = event.message.text;
      let payload;
      const response = await utils.openaiTextRequest(prompt);
      payload = {
        type: "text",
        text: response,
      };
    }
    await utils.reply(event.replyToken, payload);
  }
  res.send(req.method);
});
