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
add_action('wp_ajax_dt_project_forms','dt_project_forms');

function dt_project_forms() {

  //include DataTables php script
  include dirname(__FILE__) . "/wordpress_datatables/DataTables_Editor/php/DataTables.php";

  //checks that the correct Nonce was passed to show the request came from the WordPress website.
  check_ajax_referer('pa_nonce', 'secure');

  if($_SERVER['REQUEST_METHOD'] === "GET" && isset($_GET['vars'])) {
    $user_group_id = $_GET['vars']['user_group_ids'];
  }
  

  //setup the editor object
  $editor = Editor::inst( $db, 'project_forms_info' )

  //prepare fields from mysql table
  ->fields(
    Field::inst( 'project_forms_info.id' )->validator( 'Validate::notEmpty' ),
    Field::inst( 'project_forms_info.project_id' ),
    Field::inst( 'project_forms_info.project_name' ),
    Field::inst( 'project_forms_info.project_slug' ),

    Field::inst( 'project_forms_info.form_id' ),
    Field::inst( 'project_forms_info.project_kobotools_account' ),

    Field::inst( 'xls_forms.form_title'),
    Field::inst( 'xls_forms.form_id'),
    Field::inst( 'xls_forms.default_language'),
    Field::inst( 'xls_forms.version'),
    Field::inst( 'xls_forms.instance_name'),

    Field::inst( 'project_forms_info.form_kobo_id' ),
    Field::inst( 'project_forms_info.deployed' ),
    Field::inst( 'project_forms_info.count_records' )

  )
  ->leftJoin('xls_forms','xls_forms.id','=','project_forms_info.form_id')

  ->where( function($q) use ($user_group_id) {
    $q->where("project_forms_info.project_id",'0',"=");
    foreach($user_group_id as $group){
      $q->or_where("project_forms_info.project_id",$group);
    }
  })
  
  ;

  $data = $editor
  ->process( $_POST )
  ->data();

  echo json_encode($data);

  wp_die();

}


