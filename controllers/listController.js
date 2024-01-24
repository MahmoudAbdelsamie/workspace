const Space = require('../models/space');
const User = require('../models/user');
const List = require('../models/lists');
const UserWorkspace = require('../models/userWorkspace');


exports.createList = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const { name, description } = req.body;

        const space = await Space.findByPk(spaceId);
        if(!space) {
            return res.status(404).json({ error: 'Space not found' });
        }

        const list = await List.create({ name, description });

        await space.addList(list);

        return res.status(201).json({ message: 'List created successfully', list });
    } catch(error) {
        return res.status(500).json( { error: 'Internal Server Error' });
    }
};


exports.getLists = async (req, res) => {
    try {
        const { spaceId } = req.params;

        const space = await Space.findByPk(spaceId, {
            include: [{model: List }],
        });

        if(!space) {
            return res.status(404).json( { error: 'Space not found' });
        }

        const lists = space.Lists;

        return res.status(200).json( { lists });
    } catch(error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



exports.updateList = async (req, res) => {
    try {
        const { listId } = req.params;
        const { name, description } = req.body;

        const list = await List.findByPk(listId);
        if(!list) {
            return res.status(404).json({ error: 'List not found'});
        }

        await list.update({ name, description });

        return res.status(200).json( { message: 'List updated successfully', list });
    } catch(error) {
        return res.status(500).json( { error: 'Internal Server Error'});

    }
};



exports.deleteList = async (req, res) => {
    try {
        const { listId } = req.params;

        const list = await List.findByPk(listId);
        if(!list) {
            return res.status(404).json({ error: 'List not found'});
        }

        await list.destroy();

        return res.status(200).json({ message: 'List deleted successfully' });

    } catch(error) {
        return res.status(500).json( { error: 'Internal Server Error'});
    }
};



exports.addUsersToList = async (req, res) => {
    try {
        const { listId } = req.params;
        const { userIds } = req.body;

        const list = await List.findByPk(listId);
        if(!list) {
            return res.status(404).json({ error: 'List not found'});
        }

        const users = await User.findAll({ where: { id: userIds } });
        if(users.length !== userIds.length) {
            return res.status(404).json({ error: 'One or More users not found' });

        }

        const space = await list.getSpace();
        const spaceUsers = await space.getUsers();
        const invalidUsers = users.filter( user => !spaceUsers.includes(user));

        if( invalidUsers.length > 0 ) {
            return res.status(403).json({ error: 'One or More users are not part of the space' });
        }

        await list.addUsers(users);

        return res.status(200).json( { message: 'Users added to the list successfully' });
    } catch(error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




exports.getListById = async (req, res) => {
    try {
        const { listId } = req.params;

        const list = await list.findByPk(listId, {
            include: [
                { model: User },
                { model: Space },
            ],
        });

        if(!list) {
            return res.status(404).json({ error: 'List not found'});
        }

        return res.status(200).json( { list });
    } catch(error) {
        return res.status(500).json( { error: 'Internal Server Error' });
    }
};



