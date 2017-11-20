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
Editor::inst( $db, 'communities' )
  ->fields(
    Field::inst( 'communities.id' )->validator( 'Validate::notEmpty' ),
    Field::inst( 'communities.community_code' )->validator( 'Validate::notEmpty' ),
    Field::inst( 'communities.community_label' ),
    Field::inst( 'communities.country_id' )
      ->options( Options::inst()
        ->table('countries')
        ->value('id')
        ->label('country_label')
      ),
    Field::inst('countries.country_label')
  )
  ->leftJoin('countries','countries.id', '=','communities.country_id')
  ->process( $_POST )
  ->json();
