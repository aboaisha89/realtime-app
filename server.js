const express = require("express");
const app = express();
const http = require("http").createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server: http });

// حفظ الطلبات الحالية
let orders = [];

wss.on("connection", ws => {
  // أرسل كل الطلبات عند الاتصال الجديد
  ws.send(JSON.stringify(orders));

  ws.on("message", msg => {
    // نتوقع msg JSON: {number, logo, highlight}
    try {
      const order = JSON.parse(msg);
      order.id = Date.now(); // رقم فريد
      orders.push(order);

      // أرسل لجميع المتصلين
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(orders));
        }
      });
    } catch(e) {
      console.error(e);
    }
  });
});

app.use(express.static("public"));

const PORT = process.env.PORT || 10000;
http.listen(PORT, () => console.log("Server running on port " + PORT));
