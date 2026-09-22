import express from 'express';
import {
  getConversations,
  createConversation,
  getConversationById,
  renameConversation,
  deleteConversation
} from '../controllers/conversationController.js';

const router = express.Router();

// Routes for /api/conversations
router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversationById);
router.patch('/:id', renameConversation);
router.delete('/:id', deleteConversation);

export default router;

