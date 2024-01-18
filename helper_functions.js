
const jwt = require('jsonwebtoken');
const multer = require('multer');


const JWT_SECRET = "mahmoudSecret";
const storage = multer.memoryStorage();

exports.authenticateToken = (req, res, next) => {
    const token = req.header('Authentication');
    if( !token ) {
        return res.status(401).json({ status_code: 403, message: 'Forbidden' });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch(error) {
        return res.status(401).json({ status_code: 401, message: 'Invalid token' });
    }

};


const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb( new Error ('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
    }
};


exports.upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter,
});
