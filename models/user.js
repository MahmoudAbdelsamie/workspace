const Workspace = require("./workspace");

User.hasMany(Workspace);
Workspace.belongsTo(User);

