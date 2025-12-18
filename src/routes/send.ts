import { Router } from 'express';
import { whatsappService } from '../whatsapp/whatsapp.service';

const router = Router();

router.post('/send', async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({
      error: 'phone and message required',
    });
  }

  try {
    await whatsappService.sendMessage(phone, message);
    res.json({ status: 'sent' });
  } catch (e: any) {
    res.status(400).json({
      error: e.message,
    });
  }
});

export default router;