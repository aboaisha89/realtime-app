const express = require("express");
const app = express();
const http = require("http").createServer(app);
const WebSocket = require("ws");

// إنشاء WebSocket على نفس السيرفر
const wss = new WebSocket.Server({ server: http });

// استقبال وإرسال الرسائل
wss.on("connection", ws => {
  ws.on("message", message => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// خدمة ملفات HTML
app.use(express.static("public"));

// البورت الأساسي لرندر
const PORT = process.env.PORT || 10000;
http.listen(PORT, () => console.log("Server running on " + PORT));
