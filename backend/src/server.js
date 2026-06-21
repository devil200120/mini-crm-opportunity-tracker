const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
