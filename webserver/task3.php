<?php
session_start();
date_default_timezone_set('Europe/Berlin');
$filename = 'data/roars.csv';
?>
<html>
<head>
    <title>Roary</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <?php
        $user_id = $_SESSION["userId"];   
        $email = $_SESSION["email"];        
        if(!isset($email)) {
            header('Location: http://localhost/cgi-bin/login.php');
        }            
        echo "<meta name='email' content='$email'>";
    ?>
    <script>
        function fetchNewRoarys() {
            let email = document.querySelector('meta[name=email]').content;           
            const Http = new XMLHttpRequest();
            const url='getRoarys.php?email=' + email;
            Http.open("GET", url);
            Http.send();

            Http.onreadystatechange = function(e) {
                let data = JSON.parse(Http.responseText);                            
                var content = "";
                for (var x = 0; x < data.length; x++) {
                    var time = new Date(data[x].time * 1000);
                    var timeString = time.getDate() + ". " + (time.getMonth() + 1) + ". " + time.getFullYear() + ", " + time.getHours() + ":" + time.getMinutes();
                    content += "<div class='card' style='20px 0;'><div class='card-body'><h5 class='card-title'>" + data[x].title + "</h5><p>" + data[x].message + "</p><div class='card-footer'><small class='text-muted'>" + timeString + "</small></div></div></div>";
                }
                document.getElementById('cards').innerHTML = content;                
            }
        }
        setInterval(fetchNewRoarys, 1 * 1000);
        fetchNewRoarys();
    </script>


</head>

<?php
// Create (connect to) SQLite database in file
$db = new PDO('sqlite:/var/www/data/roary.db');

// Set errormode to exceptions
$db->setAttribute(PDO::ATTR_ERRMODE, 
            PDO::ERRMODE_EXCEPTION);

// Creates user table if neccessary
$db->exec("CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY, 
    title TEXT, 
    message TEXT, 
    time INTEGER)");

?>
<body style="padding: 5rem 20rem;">
    <div class="card">
        <div class="card-header">New Post</div>
          <div class="card-body">
              
                <?php
                    echo "<div class='alert alert-info'>Logged in as User: $email</div>";
                ?>
                
              <?php
              if (isset($_POST['logout'])) {     
                    session_destroy();
                    header('Location: http://localhost/cgi-bin/login.php');
              }
              if (isset($_POST['submit'])) {                 
                  $msg = $_POST['message'];
                  if(strlen($msg) > 128) {
                      echo "<div class='alert alert-danger'>Message text should not be longer than 128 characters!</div>";
                  } else {
                    $time = time();
                    $line = array($name, $msg, $time);
                      
                    // Prepare INSERT statement to SQLite3 file db
                    $insert = "INSERT INTO messages (title, message, time) VALUES (:title, :message, :time)";
                    $stmt = $db->prepare($insert);                   
                    
                    $data = [
                        'title' => $email,
                        'message' => $msg,
                        'time' => $time,
                    ];

                    // Execute statement
                    $stmt->execute($data); 
                  }
              }
              ?>
            <form method="post" action="">
                <label for="exampleInputEmail1">Name</label>
                <input type="text" name="name" value="<?php echo $email ?>" disabled="disabled" class="form-control" id="exampleInputEmail1" placeholder="Enter your name">
                <br />
                <label for="exampleInputEmail1">Message</label>
                <textarea name="message" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                <br />
                <input type="submit" name="submit" class="btn btn-primary"/>
                <input type="submit" name="logout" value="Logout" class="btn btn-secondary"/>
            </form>
          </div>
    </div>
<br />
<br />

<section id='cards'>
<?php
$stm = $db->prepare("SELECT title, message, time FROM messages WHERE title = :email ORDER BY time DESC;");   
$stm->execute([':email' => $email]);
while ($row = $stm->fetch()) {
    ?>
    <div class="card" style=' 20px 0;'>
       <div class="card-body">
          <h5 class="card-title"><?php echo htmlspecialchars($row['title']) ?></h5>
          <p><?php echo htmlspecialchars($row['message']) ?></p>
          <div class="card-footer">
             <small class="text-muted"><?php echo gmdate("d. m. Y, H:i", $row['time']); ?></small>
          </div>
       </div>
    </div>
    <?php 
}
?>
</section>
</body>
</html>
