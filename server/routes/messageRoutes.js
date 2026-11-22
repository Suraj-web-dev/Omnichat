import express from 'express';
import {
  sendMessageAndGenerate3Models,
  selectWinningModel,
  synthesizeAndSelectWinner,
  judgeAndScoreMessage,
  getMessagesByConversation
} from '../controllers/messageController.js';

const router = express.Router();

// Routes for messages attached to conversations
router.post('/:id/messages', sendMessageAndGenerate3Models);
router.patch('/:id/messages/:messageId/select', selectWinningModel);
router.post('/:id/messages/:messageId/synthesize', synthesizeAndSelectWinner);
router.post('/:id/messages/:messageId/judge', judgeAndScoreMessage);
router.get('/:id/messages', getMessagesByConversation);

export default router;

