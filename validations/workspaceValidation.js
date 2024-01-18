const { check } = require('express-validator')

exports.validateWorkspaceInputs = [
    check('name').notEmpty().withMessage('Workspace name is required'),
    check('numPeople').notEmpty().withMessage('Number of People must be provided'),
    check('industry').notEmpty().withMessage('Industry must be provided.'),
    check('userRole').notEmpty().withMessage('User Role must be included.'),


];