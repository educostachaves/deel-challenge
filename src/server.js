const app = require('./app');
const serverConfig = require('./config/server');

const { port } = serverConfig;

init();

async function init() {
  try {
    app.listen(port, () => {
      console.log(`Express App Listening on Port ${port}`);
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
