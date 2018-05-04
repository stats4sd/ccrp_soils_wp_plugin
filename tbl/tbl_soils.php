<?php

/*
 * Example PHP implementation used for the index.html example
 */

//get user group submitted: 
//

// Alias Editor classes so they are easy to use
use
  DataTables\Editor,
  DataTables\Editor\Field,
  DataTables\Editor\Format,
  DataTables\Editor\Mjoin,
  DataTables\Editor\Options,
  DataTables\Editor\Upload,
  DataTables\Editor\Validate;

//add the action into the WordPress Ajax hook, so it can be called with WP authentication / security:
add_action('wp_ajax_dt_soils','dt_soils');

function dt_soils() {

  //include DataTables php script
  include dirname(__FILE__) . "/wordpress_datatables/DataTables_Editor/php/DataTables.php";

  //checks that the correct Nonce was passed to show the request came from the WordPress website.
  check_ajax_referer('pa_nonce', 'secure');

  if($_SERVER['REQUEST_METHOD'] === "GET" && isset($_GET['vars'])) {
    $user_group_id = $_GET['vars']['user_group_ids'];
  }
  

  //setup the editor object
  $editor = Editor::inst( $db, 'samples' )

  //prepare fields from mysql table
  ->fields(
    Field::inst( 'samples.id' )->validator( 'Validate::notEmpty' ),
    Field::inst( 'samples.sampling_date' ),
    Field::inst( 'samples.collector_name' ),
    Field::inst( 'samples.sampling_depth' ),
    Field::inst( 'samples.sample_comments' ),
    Field::inst( 'samples.project_id' )

  )
  // 1 - many joins
  ->leftJoin('farmers','farmers.id', '=','samples.farmer_id')
  ->leftJoin('communities','communities.id','=','farmers.community_id')

  //full joins to other tables;
  ->join(
    Mjoin::inst('analysis_poxc')
    ->link('samples.id','analysis_poxc.sample_id')
    ->fields(
      Field::inst('analysis_date'),
      Field::inst('colorimeter'),
      Field::inst('colorimeter_100'),
      Field::inst('colorimeter_calc'),
      Field::inst('comment_cloudy'),
      Field::inst('conc_digest'),
      Field::inst('id'),
      Field::inst('moisture_corrected'),
      Field::inst('photo'),
      Field::inst('poxc_corrected_moisture'),
      Field::inst('poxc_insample'),
      Field::inst('poxc_insoil'),
      Field::inst('raw_conc_extract'),
      Field::inst('sample_id'),
      Field::inst('soil_moisture'),
      Field::inst('weight_soil')
    )
  )
  ->join(
    Mjoin::inst('analysis_ph')
    ->link('samples.id','analysis_ph.sample_id')
    ->fields(
      Field::inst('comment_ph_stability'),
      Field::inst('ph'),
      Field::inst('volume_water'),
      Field::inst('weight_soil'),
      Field::inst('analysis_date')
    )
  )
  ->join(
    Mjoin::inst('analysis_p')
    ->link('samples.id','analysis_p.sample_id')
    ->fields(
      Field::inst('analysis_date'),
      Field::inst('colorimeter'),
      Field::inst('colorimeter_100'),
      Field::inst('comment_cloudy_solution'),
      Field::inst('raw_conc_extract'),
      Field::inst('soil_conc_olsen'),
      Field::inst('volume_filtered_extract'),
      Field::inst('volume_topup'),
      Field::inst('weight_soil')
    )
  )
  ->where( function($q) use ($user_group_id) {
    $q->where("samples.project_id",'0',"=");
    foreach($user_group_id as $group){
      $q->or_where("samples.project_id",$group);
    }
  });

  $data = $editor
  ->process( $_POST )
  ->data();

  echo json_encode($data);

  wp_die();

}


