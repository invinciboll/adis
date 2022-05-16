<?php
session_start();
?>
<html>
<head>
    <title>Login</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
</head>

<body style="padding: 5rem 20rem;">
    <div class="card">
        <div class="card-header">Login</div>
          <div class="card-body">
              <?php
    
              //error_reporting(E_ALL);
              //ini_set('display_errors', 'on');

              if (isset($_POST['submit'])) {
                  $email = $_POST['email'];
                  $password = $_POST['password'];
                  $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                  
                  date_default_timezone_set('UTC');

                  // Create (connect to) SQLite database in file
                  $db = new PDO('sqlite:/var/www/data/roary.db');

                  // Set errormode to exceptions
                  $db->setAttribute(PDO::ATTR_ERRMODE, 
                            PDO::ERRMODE_EXCEPTION);
                
                  // Creates user table if neccessary
                  $db->exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)");

                  // Searches for existing account
                  $stm = "SELECT * FROM users WHERE email = '$email'";
                  $result = $db->query($stm)->fetchAll();
                  $resultCount = count($result);

                  if($resultCount == 0){
                    echo "<div class='alert alert-danger'>No user exists with this email!</div>";
                    return;
                  }

                  $userEntry = $result[0];

                  $correctPassword = password_verify($password, $userEntry['password']);

                  if($correctPassword){
                    echo "<div class='alert alert-success'>Login successful!</div>";
                    $_SESSION["userId"] = $userEntry["id"];
                    $_SESSION["email"] = $userEntry["email"];
                    header('Location: http://localhost/cgi-bin/task3.php');
                    exit;
                  }else{
                    echo "<div class='alert alert-danger'>Login not successful!</div>";
                  }
                }
              ?>
            <form method="post" action="">
                <label for="email">E-Mail</label>
                <input type="email" name="email" class="form-control" id="email" placeholder="Enter your E-Mail" required>
                <br />
                <label for="password">Password</label>
                <input type="password" pattern=".{6,}" title="Must contain at least 6 or more characters" name="password" class="form-control" id="password" placeholder="Enter your Password" required>
                <br />
                <input type="submit" name="submit" class="btn btn-primary" value="Login">
            </form>
          </div>
    </div>
<br />
<br />

</body>
</html>
