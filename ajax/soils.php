<?php

/*
 * Example PHP implementation used for the index.html example
 */

// DataTables PHP library
include( "../js/Editor-PHP-1.6.5/php/DataTables.php" );

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
    Field::inst( 'samples.sample_comments' ),
    Field::inst( 'samples.plot_id'),
    Field::inst('plots.plot_name'),
    Field::inst('plots.plot_gradient'),
    Field::inst('plots.soil_texture'),
    Field::inst('plots.farmer_kn_soil'),
    Field::inst('plots.latitude'),
    Field::inst('plots.longitude'),
    Field::inst('plots.altitude'),
    Field::inst('plots.accuracy')
  )

  ->leftJoin('plots','plots.id', '=','samples.plot_id')
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
