import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  ConnectionState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import QRCode from "qrcode";
import path from "path";

class WhatsAppService {
  private socket: any;
  private ready = false;

  async init() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    this.socket = makeWASocket({
      auth: state,
      printQRInTerminal: false,
    });

    this.socket.ev.on("creds.update", saveCreds);

    /** generate qr png */
    this.socket.ev.on(
      "connection.update",
      async (update: Partial<ConnectionState>) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          const qrPath = path.resolve(__dirname, "../../auth/whatsapp-qr.png");
          await QRCode.toFile(qrPath, qr);
          console.log(`QR code saved to ${qrPath}`);
        }

        if (connection === "open") {
          this.ready = true;
          console.log("WhatsApp connected ✅");
        }

        if (connection === "close") {
          this.ready = false;

          const reason = (lastDisconnect?.error as Boom)?.output?.statusCode;
          if (reason !== DisconnectReason.loggedOut) {
            console.log("WhatsApp disconnected, reconnecting...");
            await this.init();
          }
        }
      }
    );
  }
  
  /** normalization phone number */
  private normalizeJid(phone: string): string {
    const clean = phone.replace(/\D/g, "");
    return `${clean}@s.whatsapp.net`;
  }

  async sendMessage(phone: string, text: string) {
    if (!this.ready || !this.socket) {
      throw new Error("WhatsApp not connected yet");
    }

    const jid = this.normalizeJid(phone);

    const [result] = await this.socket.onWhatsApp(jid);
    if (!result?.exists) {
      throw new Error("Phone number is not registered in WhatsApp");
    }

    await this.socket.sendMessage(jid, { text });
  }
}

export const whatsappService = new WhatsAppService();
