import express from 'express'
const app = express()
const port = 3000

app.use(express.static("public"));

app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});