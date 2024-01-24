const Workspace = require('../models/workspace');
const User = require('../models/user');
const UserWorkspace = require('../models/userWorkspace');
const Space = require('../models/space');




exports.createSpace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { name, color, description } = req.body;

        const workspace  = await Workspace.findByPk(workspaceId);
        if(!workspace) {
            return res.status(404).json( { error: 'Workspace not found' });

        }

        const space  = await Space.create( { name, color, description });

        await workspace.addSpace(space);

        return res.status(201).json( { message: 'Space created successfully', space});

    } catch(error) {
        return res.status(500).json( { error: 'Internal Server  Error' });
    }
};


exports.getSpaces = async (req, res) => {
    try {
        const { workspaceId } =  req.params;

        const workspace = await Workspace.findByPk(workspaceId, {
            include: [{ model: Space, through: UserWorkspace}],
        });

        if(!workspace) {
            return res.status(404).json( { error: 'Workspace not found' } );
        }

        const spaces = workspace.spaces;

        return res.status(200).json( { spaces });
    } catch(error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.updateSpace = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const { name, color, description } = req.body;

        const space = await Space.findByPk(spaceId);
        if(!space) {
            return res.status(404).json({ error: 'Space not found' } );
        }

        await space.update( { name, color, description });

        return res.status(200).json({ message: 'Space updated successfully', space});
    } catch(error) {
        return res.status(500).json( { error: 'Internal Server Error' });
    }
};


exports.addUsersToSpace = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const { userIds } = req.body;

        const space = await Space.findByPk(spaceId);
        if(!space) {
            return res.status(404).json({ error: 'Space not found'})
        }

        const users = await User.findAll( { where: { id: userIds }});
        if(users.length !== userIds.length) {
            return res.status(404).json({ error: 'One or more users not found' });
        }

        const workspace = await space.getWorkspace();
        const workspaceUsers = await workspace.getUsers();
        const invalidUsers = users.filter(user => !workspaceUsers.includes(user));
        
        if(invalidUsers.length > 0) {
            return res.status(403).json( { message: 'One or More users are not part of the workspace' });

        }

        await space.addUsers(users);

        return res.status(200).json({ message: 'Users added to the space successfully'})

    } catch(error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.deleteSpace = async (req, res) => {
    try {
        const { spaceId } = req.params;

        const space = await Space.findByPk(spaceId);
        if(!space) {
            return res.status(404).json({ message: 'Space not found' });
        }

        await space.destroy();

        return res.status(200).json({ message: 'Space deleted successfully'});
    } catch(error) {
        return res.status(500).json( { error: 'Internal Server Error'});
    }
};


exports.getSpaceById = async (req, res) => {
    try {
        const { spaceId } = req.params;

        const space = await Space.findByPk(spaceId, {
            include: [
                { model: User, through: UserWorkspace },
                { model: List },
            ],
        });

        if(!space) {
            return res.status(404).json( { error: 'Space not found' });
        }

        return res.status(200).json({ space });
    } catch(error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};