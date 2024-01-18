const sizeOf = require('image-size');
const { validationResult } = require('express-validator')
const Workspace = require('../models/workspace');
const validateWorkspaceInputs = require('../validations/workspaceValidation').validateWorkspaceInputs;
const { authenticateToken, upload } = require('../helper_functions')


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




module.exports = { createWorkspace, updateWorkspace, deleteWorkspace, getWorkspace }