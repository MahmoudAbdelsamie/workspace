const router = require('express').Router();
const spaceController = require('../controllers/spaceController');

// Space CRUD 

router.post('/create', spaceController.createSpace);
router.get('/all', spaceController.getSpaces);
router.put('/:spaceId/update', spaceController.updateSpace);
router.delete('/:spaceId/update', spaceController.deleteSpace);
router.get('/:spaceId', spaceController.getSpaceById);
router.post('/:spaceId/add-users', spaceController.addUsersToSpace);

module.exports = router;
