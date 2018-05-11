import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from './routes/index.mjs';

const app = express();
const port = process.env.PORT || 8000;

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

// fake user object
app.use((req, res, next) => {
  req.user = { isAdmin: true };
  next();
});

routes(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
