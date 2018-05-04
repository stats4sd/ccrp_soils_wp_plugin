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
add_action('wp_ajax_dt_xls_form_questions','dt_xls_form_questions');

function dt_xls_form_questions() {

  //include DataTables php script
  include dirname(__FILE__) . "/wordpress_datatables/DataTables_Editor/php/DataTables.php";

  //checks that the correct Nonce was passed to show the request came from the WordPress website.
  check_ajax_referer('pa_nonce', 'secure');


  //setup the editor object
  $editor = Editor::inst( $db, 'xls_form_questions' )

  //prepare fields from mysql table
  ->fields(
      Field::inst('xls_form_questions.id')->validator('Validate::notEmpty'),
      FIeld::inst('xls_form_questions.type')->validator('Validate::notEmpty'),
      Field::inst('xls_form_questions.name')->validator('Validate::notEmpty'),
      Field::inst('xls_form_questions.label'),
      Field::inst('xls_form_questions.hint'),
      Field::inst('xls_form_questions.constraint'),
      Field::inst('xls_form_questions.constraint_message'),
      Field::inst('xls_form_questions.required'),
      Field::inst('xls_form_questions.required_message'),
      Field::inst('xls_form_questions.appearance'),
      Field::inst('xls_form_questions.default'),
      Field::inst('xls_form_questions.relevant'),
      Field::inst('xls_form_questions.calculation'),
      Field::inst('xls_form_questions.count'),
      Field::inst('xls_form_questions.form_id')
  );

  ///// NOTE - getting individual question record is disabled in favour of getting all questions by FORM ID
  //if the request is a GET (action = fetch), and there is a $_GET['id'] defined, then filter the results to only return the requested record:
  if($_SERVER['REQUEST_METHOD'] === "GET" && isset($_GET['id'])){
    $id = $_GET['id'];

    //add where filter to $editor:
    $editor = $editor->where('xls_form_questions.form_id',$id);
  }

  $data = $editor
  ->process( $_POST )
  ->data();

  echo json_encode($data);

  wp_die();

}


