WhatsApp Messaging Service
A Node.js service to send WhatsApp messages via the Baileys library with persistent authentication. Once you scan the QR code the first time, authentication is saved and you don’t need to scan again.

Features
Send messages via HTTP POST /send.
Automatic QR code generation and saving as PNG to auth.
Persistent credentials (auth/ folder) to avoid rescanning.
Automatic reconnection if WhatsApp disconnects.
Checks if the target phone number is registered on WhatsApp.
Folder Structure
src/ ├─ routes/ │ └─ send.ts ├─ whatsapp/ │ └─ whatsapp.service.ts ├─ app.ts └─ index.ts auth/ <- QR & credentials will be saved here

bash
git clone
npm install
npm run dev
Add .gitignore to exclude credentials:

gitignore
Copy code
auth/
node_modules/
Usage
Start the server:

bash
Copy code
npm run dev
On first run, scan the QR code printed in the console or saved as a PNG in auth/.

Send a message via HTTP POST:

bash
Copy code
POST http://localhost:3000/send
Content-Type: application/json

{
  "phone": "374XXXXXXXX",
  "message": "Hello from WhatsApp Service!"
}
Response:

json
Copy code
{
  "status": "sent"
}
Notes

Messages can only be sent to registered WhatsApp numbers.

The service automatically reconnects if disconnected, but if you log out, you will need to scan the QR code again.
