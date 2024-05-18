import express from 'express'
const app = express()
const port = 3000

const logIp = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`User IP: ${ip}`);
  next();
};

app.use(logIp);
app.use(express.static("public"));


app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});