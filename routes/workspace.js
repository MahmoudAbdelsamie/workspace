const router = require('express').Router();

const workspaceController = require('../controllers/workspaceController')


router.post('/create', workspaceController.createWorkspace);
router.put('/:id/update', workspaceController.updateWorkspace);
router.delete('/:id/delete', workspaceController.deleteWorkspace);
router.get('/:id', workspaceController.getWorkspace);

module.exports = router;