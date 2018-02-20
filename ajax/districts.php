<?php

/*
 * Example PHP implementation used for the index.html example
 */

// DataTables PHP library
include( "../../wordpress_datatables/DataTables_Editor/php/DataTables.php" );



//$groupid = BP_Groups_Member::get_group_ids( get_current_user_id());


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
Editor::inst( $db, 'districts' )
  ->fields(
    Field::inst( 'districts.id' )->validator( 'Validate::notEmpty' ),

    // Field::inst( 'districts.district_code' )->validator( 'Validate::notEmpty' ),
    Field::inst( 'districts.district_label' )->validator( 'Validate::notEmpty'),
    Field::inst( 'districts.country_id' )->validator('Validate::notEmpty')
      ->options( Options::inst()
        ->table('countries')
        ->value('id')
        ->label('country_label')
      ),
    Field::inst('countries.country_label'),
    Field::inst( 'districts.project' )->validator('Validate::notEmpty')
      ->options( Options::inst()
        ->table('wp_bp_groups')
        ->value('id')
        ->label('name')
      ),
    Field::inst('wp_bp_groups.name')
  )
  ->leftJoin('countries','countries.id', '=','districts.country_id')
    ->leftJoin('wp_bp_groups','wp_bp_groups.id', '=','districts.project')

  ->process( $_POST )
  ->json();
