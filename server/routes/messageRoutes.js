import express from 'express';
import {
  sendMessageAndGenerate3Models,
  selectWinningModel,
  getMessagesByConversation
} from '../controllers/messageController.js';

const router = express.Router();

// Routes for messages attached to conversations
router.post('/:id/messages', sendMessageAndGenerate3Models);
router.patch('/:id/messages/:messageId/select', selectWinningModel);
router.get('/:id/messages', getMessagesByConversation);

export default router;

