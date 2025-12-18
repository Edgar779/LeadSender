import { app } from "./app";
import { whatsappService } from "./whatsapp/whatsapp.service";

async function start() {
    app.listen(3000, () => {
      console.log('🚀 Server started on port 3000');
    });
  
    whatsappService.init()
      .then(() => console.log('WhatsApp Service initialized ✅'))
      .catch(err => console.error('WhatsApp failed to init:', err));
  }
  
  start();
