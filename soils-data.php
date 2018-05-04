<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://example.com
 * @since             1.0.0
 * @package           stats4sd_api
 *
 * @wordpress-plugin
 * Plugin Name:       Soils Data
 * Plugin URI:        http://soils.stats4sd.org/
 * Description:       A small plugin to contain the custom code to interact with CCRP soils data
 * Version:           0.0.1
 * Author:            Stats4SD
 * Author URI:        http://example.com/
 * License:           GPL-3.0+
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:       ccrp-soils
 * Domain Path:       /languages
 */


// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Require Guzzle for making direct HTTP requests
require_once "vendor/autoload.php";
use GuzzleHttp\Client;


/*
All the files with names starting with "tbl_" contain AJAX functions for querying the database.
They use DataTables Editor to make the connection, to get, edit and create records in the database.

So, all the "tbl_" files are required. To avoid manually specifying all of them, instead scan the directory and add all that are found.
 */


// *****************************************************
// Scan the current directory for files to require:
// *****************************************************
foreach(scandir(dirname(__FILE__) . "/tbl") as $filename) {
  // if filename starts with "tbl_" and has a php file extension.

  if(substr($filename,0,4)=="tbl_" && substr($filename,-4,4)==".php"){
    $path = dirname(__FILE__) . "/tbl/" . $filename;

    //double check the file exists
    if(is_file($path)){
      //require the file
      require_once $path;
    }
  }
}

class Soils_Data_Plugin {
  
  // *****************************************************
  // Initialise the plugin
  // *****************************************************
  public function __construct() {

    //add WordPress hooks / actions here:

    //queue general scripts
    add_action('wp_enqueue_scripts',array($this,'dt_scripts'));

    //find and queue page-specific scripts
    add_action('wp_enqueue_scripts',array($this,'init_js'));

    //create extra things when new group is created:
    add_action('groups_group_create_complete',array($this,'create_bp_group_extra'));

  }

  // *****************************************************
  // Convenience function to get a particular set of values to 'localize' javascript files:
  // *****************************************************
  public function getLocal() {
    $config = parse_ini_file('/opt/soils_conini.php',true);


    $user_groups = BP_Groups_Member::get_group_ids( get_current_user_id());

    $user_groups = $user_groups['groups'];

    if ( !function_exists( 'groups_get_group' ) ) {
        require_once get_site_url() . 'wp-content/plugins/buddypress/bp-groups/bp-groups-functions.php';
    } 

    $groups = array_map(function($id){
      $group = groups_get_group($id);
      $group->kobotools_account = groups_get_groupmeta($id,"kobotools_account");
      return $group;
    }, $user_groups);

    return array(
      'user_id' => get_current_user_id(),
      'site_url' => get_site_url(),
      'ajax_url' => admin_url('admin-ajax.php'),
      'mustache_url' => plugin_dir_url(__FILE__) . "/views",
      'nonce' => wp_create_nonce('pa_nonce'),
      'node_url' => $config['urls']['node_url'],
      'user_group_ids' => $user_groups,
      'user_groups' => $groups
    );
  }

  // *****************************************************
  // Function to add the needed Javascript files for each page into the queue:
  // *****************************************************
  public function init_js() {
    GLOBAL $post;

    $localize = $this->getLocal();

    //get the slug for the current page:
    $post_slug = $post->post_name;

    //check if there is an associated Javascript file (associated by filename);
    $scriptpath = "js/" . $post_slug . ".js";
    //check if there is a javascript file for the current page.
    if(file_exists(plugin_dir_path(__FILE__) . $scriptpath)) {

      //if there is - enqueue it and pass it the $localize aray as "vars"
      wp_register_script($post_slug, plugin_dir_url(__FILE__) . $scriptpath, array('jquery'),time(),true);
      
      //localizing passes the $localize array into the javascript with the given variable name, in this case "vars":
      wp_localize_script($post_slug, 'vars', $localize);
      wp_enqueue_script($post_slug);
    }

    //custom files:
    wp_register_script('qr-codes', plugin_dir_url(__FILE__) . "js/code-builder.js", array('jquery'),time(),true);
    
    //localizing passes the $localize array into the javascript with the given variable name, in this case "vars":
    wp_localize_script('qr-codes', 'vars', $localize);
    wp_enqueue_script('qr-codes');

  }

  // *****************************************************
  // Queue dependancies, including DataTables
  // *****************************************************
  public function dt_scripts() {

    $localize = $this->getLocal();

    //plugin css file: 
    wp_enqueue_style( 'soils-style', plugin_dir_url( __FILE__ ) .'css/soils-style.css',array(),time() );

    wp_register_script( 'popper-script',  plugin_dir_url(__FILE__) . "js/node_modules/popper.js/dist/umd/popper.min.js", array(), time(), true );
    wp_enqueue_style( 'dt_style',plugin_dir_url( __FILE__ ) . "tbl/wordpress_datatables/DataTables/datatables.min.css", time() );

    //register and queue the general datatables functions:
    wp_register_script("datatables_custom", plugin_dir_url(__FILE__) . "js/datatables.js", array('jquery'),time(),true);
    wp_localize_script("datatables_custom", 'vars', $localize);


    wp_register_script( 'dt-script', plugin_dir_url( __FILE__ ) . "tbl/wordpress_datatables/DataTables/datatables.min.js", array( 'jquery', 'popper-script')  , time(), true );
    
    wp_enqueue_style( 'editor-bootstrap-style', plugin_dir_url( __FILE__ ) ."tbl/wordpress_datatables/DataTables_Editor/css/editor.bootstrap4.min.css",array(),time() );
    
    wp_register_script( 'dt-editor-script', plugin_dir_url( __FILE__ ) . "tbl/wordpress_datatables/DataTables_Editor/js/dataTables.editor.min.js", array( 'jquery','dt-script' ), time(), true );
    wp_register_script( 'editor-bootstrap-script', plugin_dir_url( __FILE__ ) ."tbl/wordpress_datatables/DataTables_Editor/js/editor.bootstrap4.min.js", array( 'jquery','dt-script' ), time(), true );

    //add yadtcf (very useful bonus when using datatables):
    wp_enqueue_style( 'yadcf-style', plugin_dir_url( __FILE__ ) ."tbl/wordpress_datatables/yadcf/jquery.dataTables.yadcf.css",array(),time() );
    wp_register_script( 'yadcf-script', plugin_dir_url( __FILE__ ) ."tbl/wordpress_datatables/yadcf/jquery.dataTables.yadcf.js", array( 'jquery','dt-script' ), time(), true );

    //add Select2 scripts:
    wp_enqueue_style('select2-style',plugin_dir_url( __FILE__ ) . "js/node_modules/select2/dist/css/select2.min.css","4.0.6");
    wp_register_script('select2-script',plugin_dir_url( __FILE__ ) . "js/node_modules/select2/dist/js/select2.full.min.js",array('jquery'),"4.0.6",true);

    //register and queue js mustache (for calling and rendering mustache templates client-side);
    wp_register_script("mustache-js", plugin_dir_url(__FILE__) . "js/node_modules/mustache/mustache.min.js",array(),time(),true);
    wp_localize_script("mustache-js", 'vars', $localize);
    
    wp_register_script( 'jqueryprint-script', plugin_dir_url( __FILE__ ) . 'js/jquery-print.js', array( 'jquery' ), time(), true );

    wp_register_script( 'qr-script', plugin_dir_url( __FILE__ ) . 'js/node_modules/qrcodejs/qrcode.min.js', array( 'jquery' ), time(), true );


    //add d3 and c3:
    // wp_register_script( 'd3', plugin_dir_url( __FILE__ ) . "/js/node_modules/d3/dist/d3.min.js", array(), time(), true );
    // wp_register_script( 'c3', plugin_dir_url( __FILE__ ) . "/js/node_modules/c3/c3.min.js", array('d3'), time(), true );
    // wp_enqueue_style('c3', plugin_dir_url( __FILE__ ) . "/js/node_modules/c3/c3.min.css","4.0.6");



    wp_enqueue_script('popper-script');
    wp_enqueue_script('dt-script');
    wp_enqueue_script('dt-editor-script');
    wp_enqueue_script('editor-bootstrap-script');
    wp_enqueue_script('yadcf-script');
    wp_enqueue_script('select2-script');
    wp_enqueue_script("datatables_custom");
    wp_enqueue_script("mustache-js");
    wp_enqueue_script("jqueryprint-script");
    wp_enqueue_script("qr-script");

    // wp_enqueue_script('d3');
    // wp_enqueue_script('c3');

  }

  // *******************************
  // DataTables / WP AJAX Action fixer
  // *******************************
  public function replace_dt_action($post){
    //run this function inside any WP AJAX datatables editor function. It will replace the 'action' property (needed to tell WordPress which of the AJAX functions to run) with the dt_action (needed so DataTables Editor knows whether to run a Create, Replace or Remove function on the database)
    if(isset($post['dt_action']) && isset($post['action'])) {
      $post['action'] = $post['dt_action'];
      unset($post['dt_action']);
    }

    return $post;
  }

  // *****************************************************
  // GIVE FORMS TO A NEW PROJECT
  // *****************************************************
  public function create_bp_group_extra($group_id) {
    global $wpdb;

    //get list of active soils forms;

    $forms = $wpdb->get_results("SELECT * FROM xls_forms", ARRAY_A);

    //die("<pre>" . var_export($forms,true) . "</pre>");

    //add new record to projects_forms for each form x group
    foreach($forms as $index => $form) {
      $export = "<pre>" . var_export($form,true) . "</pre><br/>#############################<br/>";
      $form_id = $form["id"];
      $data = array(
        "form_id" => $form_id,
        "project_id" => $group_id,
        "deployed" => false
      );
      $export .= "<pre>" . var_export($data,true) . "</pre><br/>#############################<br/>";

      $insert = $wpdb->insert("projects_xls_forms",$data);
            //die("<pre>" . var_export($export,true) . "</pre>");
    }


  }


  

}


// *****************************************************
// Add Additional fields to BuddyPress Groups
// *****************************************************
function bp_group_meta_init() {
  function custom_field($meta_key=''){
    //get current group id and load meta_key value if passed.
    return groups_get_groupmeta(bp_get_group_id(),$meta_key);

  }

  //function to generate the field markup for front-end form:
  function group_header_fields_markup() {
    global $bp, $wpdb;?>
    <label for="kobotools_account">Kobotoolbox Account username</label>
    <input id="kobotools_account" type="text" name="kobotools_account" value="<?php echo custom_field('kobotools_account'); ?>" />
    <br>
    <?php 
  }

  // This saves the custom group meta – props to Boone for the function
  // Where $plain_fields = array.. you may add additional fields, eg
  //  $plain_fields = array(
  //      'field-one',
  //      'field-two'
  //  );
  function group_header_fields_save( $group_id ) {
    global $bp, $wpdb;
    $plain_fields = array(
      'kobotools_account'
    );
    foreach( $plain_fields as $field ) {
      $key = $field;
      if ( isset( $_POST[$key] ) ) {
        $value = $_POST[$key];
        groups_update_groupmeta( $group_id, $field, $value );
      }
    }
  }
  add_filter( 'groups_custom_group_fields_editable', 'group_header_fields_markup' );
  add_action( 'groups_group_details_edited', 'group_header_fields_save' );
  add_action( 'groups_created_group',  'group_header_fields_save' );
   
  // Show the custom field in the group header
  function show_field_in_header( ) {
    echo "<p> Kobotoolbox account username:" . custom_field('kobotools_account') . "</p>";
  }
  add_action('bp_group_header_meta' , 'show_field_in_header') ;
}

add_action( 'bp_include', 'bp_group_meta_init' );




/*=============================================
=            Ajax Functions                   =
=============================================*/


//Function to get a defined SQL table (or view) and expose it as a json blob into javascript:
//This is an AJAX function, so first add the 2 actions to let Wordpress handle the ajax calls properly:
//
add_action('wp_ajax_get_data', 'get_data');
add_action('wp_ajax_nopriv_get_data','get_data');

function get_data() {
  //use the global $wpdb to access the main wordpress database
  GLOBAL $wpdb;


  //get table and filter info from the GET request:
  $tbl = $_POST['tbl'];
  $where = $_POST['where'];
  $equals = $_POST['equals'];

  //Create a new wpdb object to access the main soils database.
  $soilsdb = new wpdb('root','ssd@soils-dev','soils','localhost');

  //Setup main select statement;
  $sql = "SELECT * FROM ";

  //if there is a where and a filter variable:
  if($where!="" && $equals!="") {
    //Create the filter part of the query.
    $sql_where = " WHERE ";
    $sql_equals = " = ";
  } else {
    $sql_where = "";
    $sql_equals = "";
  }


  //Prepare and execute the statement against soilsdb
  $query = $soilsdb->get_results("SELECT * FROM " . $tbl . $sql_where . $where . $sql_equals . $equals . ";");


  wp_send_json_success(json_encode($query));


} //end get_data();



// add_action('wp_ajax_get_barcodes', 'get_barcodes');
// add_action('wp_ajax_nopriv_get_barcodes','get_barcodes');
// function get_barcodes() {
//   GLOBAL $wpdb, $qrcodetag;
//   $soilsdb = new wpdb('root','ssd@soils-dev','soils','localhost');

//   $community_id = $_POST['community_id'];

//   $sql = "SELECT * FROM `barcodes` WHERE `community_id`=" . $community_id;
//   $query = $soilsdb->query($sql);
//   if($query == 0) {
//     //then no barcodes were found for this community;
//     wp_send_json_success("0");
//   }
//   else {
//     $results = $soilsdb->get_results($sql);
//     //go through results and add the QR code url:
//     for($x = 0;$x < sizeof($results);$x++) {
//       $results[$x]->url = $qrcodetag->getQrCodeUrl($results[$x]->code,100,'UTF-8','L',4,0);
//     }
//     wp_send_json_success(json_encode($results));
//   }

// } //end get_barcodes()

// //get single barcode from string
// add_action('wp_ajax_get_single_barcode', 'get_single_barcode');
// add_action('wp_ajax_nopriv_get_single_barcode','get_single_barcode');
// function get_single_barcode() {
//     GLOBAL $qrcodetag;
//   $value = $_POST['value'];

//   $result = $qrcodetag->getQrCodeUrl($value,100,'UTF-8','L',4,0);
//   wp_send_json_success($result);
// } // end get single barcode. 


add_action('wp_ajax_create_barcode','create_barcode');
add_action('wp_ajax_nopriv_create_barcode','create_barcode');
function create_barcode() {
  GLOBAL $wpdb;

  if(isset($_POST['root_id'])){
    $root_id = $_POST['root_id'];
    $root_id .= "_";

  }
  else{
    $root_id = random_int(1000,9999);
    $root_id = (string)$root_id;
    $root_id .= "_";
  }

  $number = $_POST['number'];

  $query = [];
  $ids = [];
  //generate the number of barcodes asked for:
  for($i = 0; $i<$number; $i++){
    // //create entry in barcodes table (to generate an auto-increment value);
    $query[] = $wpdb->insert('barcodes',array('farm_id' => $root_id, 'status'=>"gen"));
    //get the ID of the inserted row:
    $id[] = $wpdb->insert_id;
  }

  //then, run update command to turn the newly 'gen'-ed ID into a code that can be barcoded. This code will include the country and community IDs

  $updateQuery = $wpdb->get_results("
                                       UPDATE `barcodes`
                                       SET `barcodes`.`code` = CONCAT(`farm_id`,`barcodes`.`id`), `barcodes`.`status`='coded' 
                                       WHERE `barcodes`.`status`='gen'");
  for($j=0;$j<$number;$j++){
    $id[$j] = $root_id . $id[$j];
  }
  wp_send_json_success($id);
} //end create barcode()

add_action('wp_ajax_create_community_barcodes','create_community_barcodes');
add_action('wp_ajax_nopriv_create_community_barcodes','create_community_barcodes');
function create_community_barcodes() {
  GLOBAL $wpdb;

  $farmers = $_POST['farmers'];
  $farmer_count = count($farmers);

  $query = [];
  $ids = [];
  $codes = [];
  $results = [];

  //for each farmer, generate a code and put it into array;
  for($x = 0; $x < $farmer_count; $x++) {
    // $farmer_id = $farmers[$x]['id'];
    // $farmer_name = $farmers[$x]['farmer_name'];

    //create entry in barcodes table (to generate an auto-increment value);
    $query[$x] =  $wpdb->insert('barcodes',array('farm_id' => $farmers[$x]['id'], 'status'=>"gen"));

    //get the ID of the inserted row:
    $id[$x] = $wpdb->insert_id;

    //concatenate to make the code
    $codes[$x] = $farmers[$x]['id'] . $id[$x];

    $results[$x] = array(
      "code" => $codes[$x],
      "farmer_id" => $farmers[$x]['id'],
      "farmer_name" => $farmers[$x]['farmer_name'],
    );

    //add start or end of row for printing: 
    //
    if(($x+1) % 2 == 0 ) {
      $results[$x]["start_div"] = "";
      $results[$x]["end_div"] = "</div>";
    }
    else {
            $results[$x]["start_div"] = "<div class='row'>";
      $results[$x]["end_div"] = "";
    }

  }
  //then, run update command to turn the newly 'gen'-ed AI into a code that can be barcoded. This code will include the country and community IDs

  $updateQuery = $wpdb->get_results("
                                       UPDATE `barcodes` 
                                       SET `barcodes`.`code` = CONCAT(`farm_id`,`barcodes`.`id`), `barcodes`.`status`='coded' 
                                       WHERE `barcodes`.`status`='gen'");

  wp_send_json_success($results);

} //end create barcode()

add_action('wp_ajax_update_barcodes','update_barcodes');
add_action('wp_ajax_nopriv_update_barcodes','update_barcodes');
function update_barcodes(){
  GLOBAL $wpdb, $qrcodetag;
  $soilsdb = new wpdb('root','ssd@soils-dev','soils','localhost');


  $community_id = $_POST['value'];

  $sql = "UPDATE `barcodes` set `status`='printed' where `community_id`='" . $community_id . "';";

  $query = $soilsdb->get_results($sql);
  wp_send_json_success(json_encode($query));
}


// Initialize the plugin
$soils_data = new Soils_Data_Plugin();