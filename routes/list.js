const router = require('express').Router();
const listController = require('../controllers/listController')
// List CRUD

router.post('/create', listController.createList);
router.get('/', listController.getLists);
router.put('/:listId/update', listController.updateList);
router.delete('/:listId/delete', listController.deleteList);
router.get('/:listId', listController.getListById);
router.post('/:listId/add-users', listController.addUsersToList);



module.exports = router;