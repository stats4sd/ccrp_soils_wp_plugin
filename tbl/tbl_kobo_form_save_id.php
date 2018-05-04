<?php

add_action('wp_ajax_kobo_form_save_id','kobo_form_save_id');

function kobo_form_save_id() {

  check_ajax_referer('pa_nonce', 'secure');

    $config = parse_ini_file('/opt/soils_conini.php',true);

  $user = $config['mysql']['user'];
  $host = $config['mysql']['host'];
  $db_name = $config['mysql']['db_name'];
  $password = $config['mysql']['password'];

  $conn = new mysqli($host, $user, $password, $db_name);

  if($conn->connect_error){
    die("mysql connection failed" . $conn->connect_error);

  }

  $kobo_id = $_POST['kobo_id'];
  $id = $_POST['id'];


  $sql = "UPDATE projects_xls_forms SET `form_kobo_id` = $kobo_id WHERE `id` = $id";

  if($conn->query($sql) === TRUE) {
    echo "{'status':'success'}";
    wp_die();
  }

  else{
    echo "{'status':'fail','error':" . $conn->error;
    wp_die();
  }
}