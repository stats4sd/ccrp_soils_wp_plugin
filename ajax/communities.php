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
Editor::inst( $db, 'communities' )
  ->fields(
    Field::inst( 'communities.id' )->validator( 'Validate::notEmpty' ),
    // Field::inst( 'communities.community_code' )->validator( 'Validate::notEmpty' ),
    Field::inst( 'communities.community_label' )->validator( 'Validate::notEmpty'),
    
    Field::inst( 'communities.district_id' )->validator('Validate::notEmpty')
      ->options( Options::inst()
        ->table('districts')
        ->value('id')
        ->label('district_label')
      ),
    Field::inst('districts.district_label'),
   Field::inst( 'communities.project' )->validator('Validate::notEmpty')
      ->options( Options::inst()
        ->table('wp_bp_groups')
        ->value('id')
        ->label('name')
      ),
    Field::inst('wp_bp_groups.name')

  )
  ->leftJoin('districts','districts.id', '=','communities.district_id')
  ->leftJoin('wp_bp_groups','wp_bp_groups.id', '=','communities.project')

  ->process( $_POST )
  ->json();
