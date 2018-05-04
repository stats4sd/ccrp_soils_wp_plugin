<?php

// *****************************************************
// This script uses the DataTables Editor library (https://editor.datatables.net/manual/php/)
// The function below creates an Editor object that connects to the table or view named in the initial Editor::inst() call. Other scripts can call this function via a WordPress Ajax action to SELECT, UPDATE, INSERT or DELETE records from this table or view.
// (Views are not editable directly, so views will be setup to only accept SELECT calls)
// *****************************************************
  use
    DataTables\Editor,
    DataTables\Editor\Field,
    DataTables\Editor\Format,
    DataTables\Editor\Mjoin,
    DataTables\Editor\Options,
    DataTables\Editor\Upload,
    DataTables\Editor\Validate;

add_action('wp_ajax_dt_locations_csv','dt_locations_csv');

function dt_locations_csv() {

  include dirname(__FILE__) . "/wordpress_datatables/DataTables_Editor/php/DataTables.php";

  // if($_GET['project']) {
  //   $project = $_GET['project'];
  // }
  // else{
  //   $project = 0;
  // }

  

  //checks that the correct Nonce was passed to show the request came from the WordPress website.
  check_ajax_referer('pa_nonce', 'secure');


  // Build our Editor instance and process the data coming from _POST
  $editor = Editor::inst( $db, 'locations_csv')
    ->fields(
      Field::inst('locations_csv.id'),
      Field::inst('locations_csv.plot_id'),
      Field::inst('locations_csv.plot_name'),
      Field::inst('locations_csv.plot_gradient'),
      Field::inst('locations_csv.farmer_kn_soil'),
      Field::inst('locations_csv.soil_texture'),
      Field::inst('locations_csv.farmer_id'),
      Field::inst('locations_csv.latitude'),
      Field::inst('locations_csv.longitude'),
      Field::inst('locations_csv.altitude'),
      Field::inst('locations_csv.accuracy'),
      Field::inst('locations_csv.farmer_name'),
      Field::inst('locations_csv.community_id'),
      Field::inst('locations_csv.project_id'),
      Field::inst('locations_csv.project'),
      Field::inst('locations_csv.community_label'),
      Field::inst('locations_csv.district_id'),
      Field::inst('locations_csv.district_label'),
      Field::inst('locations_csv.country_id'),
      Field::inst('locations_csv.country_label')
    );



  //if the request is a GET (action = fetch), and there is a $_GET['id'] defined, then filter the results to only return the requested record:
  if($_SERVER['REQUEST_METHOD'] === "GET" && isset($_GET['id'])){
    $id = $_GET['id'];

    //add where filter to $editor:
    $editor = $editor->where('locations_csv.id',$id);
  }

  //add a per-project filter:
  if($_SERVER['REQUEST_METHOD'] === "GET" && isset($_GET['project_id'])){
    $project_id = $_GET['project_id'];

    //add where filter to $editor:
    $editor = $editor->where('locations_csv.project_id',$project_id);
  }

  //process data from the $editor and echo it to the ajax response:
  $data = $editor
  ->process( $_POST )
  ->data();

  echo json_encode($data);

  wp_die();
}
