import express from 'express';
import {
  sendMessageAndGenerate3Models,
  selectWinningModel,
  synthesizeAndSelectWinner,
  getMessagesByConversation
} from '../controllers/messageController.js';

const router = express.Router();

// Routes for messages attached to conversations
router.post('/:id/messages', sendMessageAndGenerate3Models);
router.patch('/:id/messages/:messageId/select', selectWinningModel);
router.post('/:id/messages/:messageId/synthesize', synthesizeAndSelectWinner);
router.get('/:id/messages', getMessagesByConversation);

export default router;

