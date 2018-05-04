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

add_action('wp_ajax_dt_analysis_p','dt_analysis_p');

function dt_analysis_p() {

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
  $editor = Editor::inst( $db, 'analysis_p' )
    ->fields(
      Field::inst('analysis_p.id')->validator('Validate::notEmpty'),
      FIeld::inst('analysis_p.analysis_date'),
      Field::inst('analysis_p.weight_soil'),
      Field::inst('analysis_p.volume_filtered_extract'),
      Field::inst('analysis_p.volume_topup'),
      Field::inst('analysis_p.colorimeter'),
      Field::inst('analysis_p.colorimeter_100'),
      Field::inst('analysis_p.comment_cloudy_solution'),
      Field::inst('analysis_p.raw_conc_extract'),
      Field::inst('analysis_p.soil_conc_olsen'),
      Field::inst('analysis_p.sample_id')
    );



  //if the request is a GET (action = fetch), and there is a $_GET['id'] defined, then filter the results to only return the requested record:
  if($_SERVER['REQUEST_METHOD'] === "GET" && isset($_GET['id'])){
    $id = $_GET['id'];

    //add where filter to $editor:
    $editor = $editor->where('analysis_p.id',$id);
  }

  //process data from the $editor and echo it to the ajax response:
  $data = $editor
  ->process( $_POST )
  ->data();

  echo json_encode($data);

  wp_die();
}
