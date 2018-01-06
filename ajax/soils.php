<?php

/*
 * Example PHP implementation used for the index.html example
 */

// DataTables PHP library
include( "../../wordpress_datatables/DataTables_Editor/php/DataTables.php" );

// Alias Editor classes so they are easy to use
use
  DataTables\Editor,
  DataTables\Editor\Field,
  DataTables\Editor\Format,
  DataTables\Editor\Mjoin,
  DataTables\Editor\Options,
  DataTables\Editor\Upload,
  DataTables\Editor\Validate;

// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, 'samples' )
  ->fields(
    Field::inst( 'samples.id' )->validator( 'Validate::notEmpty' ),
    Field::inst( 'samples.sampling_date' ),
    Field::inst( 'samples.collector_name' ),
    Field::inst( 'samples.sampling_depth' ),
    Field::inst( 'samples.sample_comments' )
    //Field::inst( 'samples.farmer_id'),
    // Field::inst('samples.plot_name'),
    // Field::inst('samples.plot_gradient'),
    // Field::inst('samples.soil_texture'),
    // Field::inst('samples.farmer_kn_soil'),
    // Field::inst('samples.latitude'),
    // Field::inst('samples.longitude'),
    // Field::inst('samples.altitude'),
    // Field::inst('samples.accuracy'),
    // Field::inst('farmers.farmer_code'),
    // Field::inst('farmers.farmer_name'),
    // Field::inst('communities.community_code'),
    // Field::inst('communities.community_label'),
    // Field::inst('farmers.community_id')
  )
  ->leftJoin('farmers','farmers.id', '=','samples.farmer_id')
  ->leftJoin('communities','communities.id','=','farmers.community_id')
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

    ))
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
    ))
  ->process( $_POST )
  ->json();
