const router = require('express').Router();

const workspaceController = require('../controllers/workspaceController')


router.post('/create', workspaceController.createWorkspace);
router.put('/:id/update', workspaceController.updateWorkspace);
router.delete('/:id/delete', workspaceController.deleteWorkspace);
router.get('/:id', workspaceController.getWorkspace);


// Add Users to Workspace Route
router.post('/:id/add-users', workspaceController.addUsersToWorkspace);


// Space CRUD 

router.post('/create', workspaceController.createSpace);
router.get('/all', workspaceController.getSpaces);
router.put('/:spaceId/update', workspaceController.updateSpace);
router.delete('/:spaceId/update', workspaceController.deleteSpace);
router.get('/:spaceId', workspaceController.getSpaceById);
router.post('/:spaceId/add-users', workspaceController.addUsersToSpace);


module.exports = router;