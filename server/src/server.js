const app = require('./app');

const PORT = 4040;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Ctrl + c to close the server');
});
