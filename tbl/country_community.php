<?php

// DataTables PHP library
include( "../../wordpress_datatables/DataTables_Editor/php/DataTables.php" );


$communities = $db
  ->select('communities', ['id as value', 'community_label as label'],['country_id' => $_REQUEST['values']['communities.country_id']]);
  ->fetchAll();

echo json_encode( [
  'options' => [
    'farmers.community_id' => $communities
  ]
]);

die();

