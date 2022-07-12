const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');


const cachedObjects = new Map();

function removeCachedObject(request)
{
  cachedObjects.delete(request);
}

function cacheObject(request, object)
{
  cachedObjects.set(request, object);
}

function getCachedObject(request)
{
  const object = cachedObjects.get(request);
  return object;
}

function isRequestInCache(request)
{
  const object = cachedObjects.get(request);
  return object !== null && object !== undefined;
}


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

  let email = req.body.email.toLowerCase();
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
  let email = req.body.email.toLowerCase();

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



// get likes for specific roary
app.get('/roary/:id/likes', async (req, res) =>
{
  //console.log("Try to fetch likes for roary");

  // email which should be checked, if it has liked this specific roar
  let email = req.body.email;

  // the roary id
  let roaryId = req.params.id;

  //console.log("input roaryId: " + roaryId);
  //console.log("input email: " + email);

  let likedNumberQuery = `SELECT COUNT(*) as numberOfLikes FROM roar JOIN user ON user.id = roar.user_id JOIN favourite ON roar.id = favourite.roar_id WHERE roar.id = ${roaryId};`
  let isLikedByEmailQuery = `SELECT * FROM favourite JOIN user ON user.id = favourite.user_id JOIN roar ON roar.id = favourite.roar_id WHERE roar.id = ${roaryId} AND user.email = '${email}'`

  db.all(likedNumberQuery, function (err, rows)
  {
    if (err)
    {
      console.log(err.message);
      return res.sendStatus(400);
    } else
    {
      let numberOfLikes = rows[0].numberOfLikes;
      let likedByEmail;

      db.all(isLikedByEmailQuery, function (err, rows2)
      {
        if (err)
        {
          console.log(err.message);
          return res.sendStatus(400);
        } else
        {
          likedByEmail = rows2.length != 0;

          //console.log("numberOfLikes: " + numberOfLikes);
          //console.log("likedByEmail: " + likedByEmail);

          return res.status(200).send({
            count: numberOfLikes,
            liked: likedByEmail,
          });
        }
      });
    }
  });
})


// get all roary
app.get('/roary', async (req, res) =>
{
  console.log("Try to fetch roaries");


  let query = `SELECT roar.id AS roar_id, roar.text, roar.timestamp, user.name, user.email  FROM roar JOIN user ON user.id = roar.user_id GROUP BY roar.timestamp`;

  let request = "/roary";
  if (isRequestInCache(request))
  {
    console.log("Returned cached object");
    const rows = getCachedObject(request);
    return res.status(200).send(rows);
  }

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

      cacheObject(request, rows);

      console.log("Returned datbase object");
      return res.status(200).send(rows);
    }
  });
})



// post roary api
app.post('/roary', async (req, res) =>
{
  removeCachedObject("/roary");

  console.log("Try to post roary");
  var email = req.body.email;
  var text = req.body.text;

  console.log("Email = " + email + ", Text = " + text);

  var query = "SELECT id FROM user WHERE email = '" + email + "';";

  db.all(query, function (err, rows)
  {
    if (err)
    {
      console.log(err.message);
    }
    console.log(rows);
    var user_id = rows[0].id;
    var date = new Date().getTime();
    var sqlCommand = `INSERT INTO roar(user_id, text, timestamp) VALUES('${user_id}', '${text}', '${date}')`;
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
  });

})



// like roary api
app.post('/roary/:id/like', async (req, res) =>
{
  console.log("Try to post roary");
  var email = req.body.email;
  var roary_id = req.params.id;

  console.log("Email = " + email + ", roary_id = " + roary_id);

  var query = "SELECT id FROM user WHERE email = '" + email + "';";

  db.all(query, function (err, rows)
  {
    if (err)
    {
      console.log(err.message);
    }
    var user_id = rows[0].id;
    console.log("User-id = " + user_id);

    var query2 = `SELECT * FROM favourite WHERE user_id='${user_id}' AND roar_id='${roary_id}'`;
    db.all(query2, [], function (err, rows)
    {
      if (err)
      {
        console.log(err.message)
        return res.sendStatus(400);
      }

      if (rows.length != 0)
      {
        db.run(`DELETE FROM favourite WHERE user_id='${user_id}' AND roar_id='${roary_id}'`, [], function (err)
        {
          if (err)
          {
            console.log(err.message)
            return res.sendStatus(400);
          }

          console.log(`Favourite deleted`);
          res.sendStatus(200);
        });
        return;
      }

      var sqlCommand2 = `INSERT INTO favourite (user_id, roar_id) VALUES('${user_id}', '${roary_id}')`;
      db.run(sqlCommand2, [], function (err)
      {
        if (err)
        {
          console.log(err.message)
          return res.sendStatus(400);
        }

        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.sendStatus(200);
      });

    });
  });
})

app.listen(port, () =>
{
  console.log(`Baxkend listening on port ${port}`)
})
