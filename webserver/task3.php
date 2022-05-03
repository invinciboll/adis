<?php
date_default_timezone_set('Europe/Berlin');
$filename = 'data/roars.csv';
?>
<html>
<head>
    <title>Roary</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
</head>
<body style="padding: 5rem 20rem;">
    <div class="card">
        <div class="card-header">New Post</div>
          <div class="card-body">
              <?php
              if (isset($_POST['submit'])) {
                  $name = $_POST['name'];
                  $msg = $_POST['message'];
                  if(strlen($msg) > 128) {
                      echo "<div class='alert alert-danger'>Message text should not be longer than 128 characters!</div>";
                  } else {
                      $time = time();
                      $line = array($name, $msg, $time);
                      //add line to .csv file
                      $handle = fopen($filename, "a");
                      fputcsv($handle, $line); # $line is an array of strings (array|string[])
                      fclose($handle);
                      echo "<div class='alert alert-success'>Your message was successfully posted! =)</div>";
                  }
              }
              ?>
            <form method="post" action="">
                <label for="exampleInputEmail1">Name</label>
                <input type="text" name="name" class="form-control" id="exampleInputEmail1" placeholder="Enter your name">
                <br />
                <label for="exampleInputEmail1">Message</label>
                <textarea name="message" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                <br />
                <input type="submit" name="submit" class="btn btn-primary"/>
            </form>
          </div>
    </div>
<br />
<br />
<?php
$roars = [];
if (($h = fopen("{$filename}", "r")) !== FALSE)
{
  while (($data = fgetcsv($h, 1000, ",")) !== FALSE)
  {
    $roars[] = $data;
  }
  fclose($h);
}

//sort array
usort($roars, function ($a, $b) {
    if ($a[2] == $b[2]) {
       return 0;
    }
    return ($a[2] < $b[2]) ? 1 : -1;
});

 

foreach ($roars as $r) {
    ?>
    <div class="card" style=' 20px 0;'>
       <div class="card-body">
          <h5 class="card-title"><?php echo htmlspecialchars($r[0]) ?></h5>
          <p><?php echo htmlspecialchars($r[1]) ?></p>
          <div class="card-footer">
             <small class="text-muted"><?php echo gmdate("Y-m-d H:i:s", $r[2]); ?></small>
          </div>
       </div>
    </div>
<?php
}
?>

</body>
</html>
