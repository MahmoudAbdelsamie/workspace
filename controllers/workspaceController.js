const sizeOf = require('image-size');
const { validationResult } = require('express-validator')
const Workspace = require('../models/workspace');
const validateWorkspaceInputs = require('../validations/workspaceValidation').validateWorkspaceInputs;
const { authenticateToken, upload } = require('../helper_functions')
const User = require('../models/user');
const UserWorkspace = require('../models/userWorkspace');
const Space = require('../models/space');

const createSpace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { name, description } = req.body;

        const workspace  = await Workspace.findByPk(workspaceId);
        if(!workspace) {
            return res.status(404).json( { error: 'Workspace not found' });

        }

        const space  = await Space.create( { name, description });

        await workspace.addSpace(space);

        return res.status(201).json( { message: 'Space created successfully', space});

    } catch(error) {
        return res.status(500).json( { error: 'Internal Server  Error' });
    }
};


const getSpaces = async (req, res) => {
    try {
        const { workspaceId } =  req.params;

        const workspace = await Workspace.findByPk(workspaceId, {
            include: [{ model: Space, through: UserWorkspace}],
        });

        if(!workspace) {
            return res.status(404).json( { error: 'Workspace not found' });
        }

        const spaces = workspace.spaces;

        return res.status(200).json( { spaces });
    } catch(error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const updateSpace = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const { name, description } = req.body;

        const space = await Space.findByPk(spaceId);
        if(!space) {
            return res.status(404).json({ error: 'Space not found' } );
        }

        await space.update( { name, description });

        return res.status(200).json({ message: 'Space updated successfully', space});
    } catch(error) {
        return res.status(500).json( { error: 'Internal Server Error' });
    }
};


const addUsersToSpace = async (req, res) => {
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


const deleteSpace = async (req, res) => {
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


const getSpaceById = async (req, res) => {
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




















// Add Users to Workspace

const addUsersToWorkspace = async (req, res) => {
    try {
        const { workspaceId, userIds } = req.body;
        if( !workspaceId || !userIds || !Array.isArray(userIds) ) {
            return res.status(404).json( { error: 'Workspace not found' });
        }

        const workspace = await Workspace.findByPk(workspaceId);

        if(!workspace) {
            return res.status(404).json({ error: 'Workspace not found'})
        }

        const users = await User.findAll({ where: { id: userIds } });

        if(users.length !== userIds.length) {
            return res.status(404).json( { error: 'One or more users not found'});
        }

        await workspace.addUsers(users);
        return res.status(200).json({ message : 'Users added to workspace successfully'})

    } catch(error) {
        return res.status(500).json({ error: 'Internal Server Error'});
    }
}









const createWorkspace = [
    authenticateToken,
    ...validateWorkspaceInputs,
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });   
            }

            const uploadMiddleware = upload.fields([{ name: 'avatar', maxCount: 1 }]);
            uploadMiddleware(req, res, async (err) => {
                if(err)  {
                    console.error(err);
                    return res.status(400).json({ error : 'failed to upload file.'});
                }

                const avatarBuffer = req.files['avatar'][0].buffer;
                const dimensions = sizeOf(avatarBuffer);

                if(dimensions.width > 500 || dimensions.height > 500) {
                    return res.status(400).json({error: 'Image dimensions must be less than or equal to 500x500 pixels.'});

                }

                const avatarBase64 = avatarBuffer.toString('base64');

                const workspace = await Workspace.create({
                    name : req.body.name,
                    avatar: avatarBase64,
                    color: req.body.color,
                    numPeople: req.body.numPeople,
                    industry: req.body.industry,
                    userRole: req.body.userRole,
                    UserId: req.user.id, // here i assume that user info is available in the request


                });

                return res.status(201).json(workspace);
            });
        } catch(error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error'});
        }
    },
];


const updateWorkspace = [
    authenticateToken,
    ...validateWorkspaceInputs,
    async (req, res) => {
        try {
            const workspaceId = req.params.id;
            const workspace = await Workspace.findByPk(workspaceId);

            if(!workspace) {
                return res.status(404).json({ error: 'Workspace not found'});

            }

            // check user permission 

            if(workspace.UserId !== req.user.id) {
                return res.status(403).json({ error: 'Permission denied.' });
            }

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json( { errors: errors.array() });
            }

            workspace.name = req.body.name;
            workspace.numPeople = req.body.numPeople;
            workspace.industry = req.body.industry;
            workspace.userRole = req.body.userRole;

            if(req.body.avatar) {
                const avatarBuffer = Buffer.from(req.body.avatar, 'base64');
                const dimensions = sizeOf(avatarBuffer); 

                if(dimensions.width > 500 || dimensions.height > 500 ) {
                    return res.status(400).json({ error: 'image dimensions must be less than or equal to 500x500 pixels.'});

                }

                const avatarBase64 = avatarBuffer.toString('base64');
                workspace.avatar = avatarBase64;
            }

            await workspace.save();

            return res.status(200).json(workspace);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error'});
        }
    },
];



const deleteWorkspace = async (req, res) => {
    try {
        const workspaceId = req.params.id;
        const workspace = await Workspace.findByPk(workspaceId);

        if( !workspace ) {
            return res.status(404).json({ error: 'Workspace not found.' });

        }

        if( workspace.UserId !== req.user.id ) {
            return res.status(403).json({ error: 'Permission denied.'});
        }

        await workspace.destroy();

        return res.status(204).json();
    } catch(error){
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getWorkspace = async (req, res) => {
    try {
        const workspaceId = req.params.id;
        const workspace = await Workspace.findByPk(workspaceId);
        if( !workspace ) {
            return res.status(404).json({ error: 'Workspace not found.'});
        }

        if( workspace.UserId !== req.user.id ) {
            return res.status(403).json({ error: 'Permission denied.'});
        }

        return res.status(200).json(workspace);
    } catch(error) {
        res.status(500).json({ error: 'Internal Server Error'});
    }
};


module.exports = { createWorkspace, updateWorkspace, deleteWorkspace, getWorkspace, addUsersToWorkspace, createSpace, getSpaces, getSpaceById, deleteSpace, updateSpace, addUsersToSpace }