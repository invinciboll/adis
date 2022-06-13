const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
}));

// Important because of Cross-Origin-Access
app.use(function (req, res, next)
{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port = 3000
const saltRounds = 10;
const sqlite3 = require('sqlite3');

// Create database connection
let db = new sqlite3.Database('./database/db.sqlite', (err) =>
{
  if (err)
  {
    console.log("Error Occurred - " + err.message);
  }
  else
  {
    console.log("DataBase Connected");
  }
});

// login api
app.post('/login', async (req, res) =>
{
  console.log("Try to login");

  var email = req.body.email;
  var password = req.body.password + "";

  console.log("E-Mail = " + email + ", Password = " + password);

  var query = "SELECT password, name FROM user WHERE upper(email) = upper('" + email + "')";

  var username;
  db.all(query, function (err, rows)
  {
    if (err)
    {
      console.log(err.message);
      return res.sendStatus(400);
    } else
    {
      if (rows.length == 0)
      {
        res.sendStatus(404);
        return;
      }

      const hashedPassword = rows[0].password;
      username = rows[0].name;
      const loginSuccessful = bcrypt.compareSync(password, hashedPassword);

      if (loginSuccessful)
      {
        return res.status(200).send(username);
      } else
      {
        return res.sendStatus(401);
      }
    }
  });
})

// registration api
app.post('/register', async (req, res) =>
{
  console.log("Try to register");
  var name = req.body.name;
  var email = req.body.email;

  var password = req.body.password + "";

  console.log("Name = " + name + ", E-Mail = " + email + ", Password = " + password);

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  var sqlCommand = `INSERT INTO user(name, email, password) VALUES('${name}', '${email}', '${hash}')`;

  db.run(sqlCommand, [], function (err)
  {
    if (err)
    {
      console.log(err.message)
      return res.sendStatus(400);
    }

    console.log(`A row has been inserted with rowid ${this.lastID}`);
    res.sendStatus(200);
  });
})

app.listen(port, () =>
{
  console.log(`Baxkend listening on port ${port}`)
})