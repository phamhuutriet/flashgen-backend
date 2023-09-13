import app from "./src/app";

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Listen to port ${PORT}`);
});
