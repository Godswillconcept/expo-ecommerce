import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, '../models');

const models = {};

// Import all model files
const files = fs.readdirSync(modelsDir);
files.filter(file => file.endsWith('.model.js')).forEach(file => {
  const modelName = file.split('.')[0];
  models[modelName] = require(path.join(modelsDir, file));
});

// Set up associations here
// Example:
// User.hasMany(Order);
// Order.belongsTo(User);

export default models;
