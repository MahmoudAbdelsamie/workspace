const express = require('express');
const app = express();
const router = express.Router();

const { createWorkspace, updateWorkspace } = require('../controllers/workspaceController')


router.post('/create', createWorkspace);
router.put('/:id/update', updateWorkspace);
// router.delete('/:id/delete', workspaceController.deleteWorkspace);
// router.get('/:id', workspaceController.getWorkspace);

module.exports = router;