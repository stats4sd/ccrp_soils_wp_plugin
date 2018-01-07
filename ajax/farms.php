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
Editor::inst( $db, 'farmers' )
  ->fields(
    // Farm-level data
    Field::inst( 'farmers.id' )->validator( 'Validate::notEmpty' ),
    // Field::inst( 'farmers.farmer_code' )->validator( 'Validate::notEmpty' ),
    Field::inst( 'farmers.farmer_name' ),
    Field::inst( 'farmers.community_id' )
      ->options( Options::inst()
        ->table('communities')
        ->value('id')
        ->label('community_label')
      ),
    //Community-level data:
    Field::inst('communities.community_label'),
    // Field::inst('communities.country_id')
    //   ->options( Options::inst()
    //     ->table('countries')
    //     ->value('id')
    //     ->label('country_label')
    //     ),
    //   Field::inst('countries.country_label')
    Field::inst('farmers.project')
    ->options( Options::inst()
              ->table('wp_bp_groups')
              ->value('id')
              ->label('name')),
    Field::inst('wp_bp_groups.name'),
    Field::inst('projects.code')

   
  )
  ->leftJoin('communities','communities.id', '=','farmers.community_id')
  ->leftJoin('wp_bp_groups','wp_bp_groups.id', '=','farmers.project')
  ->leftJoin('projects','projects.id','=','farmers.project')
  ->process( $_POST )
  ->json();
