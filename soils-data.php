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




//enqueue the styles and scripts for this plugin.
//This includes a downloaded (static) version of DataTables and YADCF (yet-another-datatables-column-filter). This is to enable this plugin to function independantly of whether (or when) those jquery libraries change.
add_action('wp_enqueue_scripts','soils_scripts');
function soils_scripts() {

	wp_enqueue_style( 'soils-style', plugin_dir_url( __FILE__ ) .'/css/soils-style.css',array(),time() );
  //select 2 scripts: 
  
  wp_enqueue_style('select2-style',"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css","4.0.6");
  wp_enqueue_script('select2-script',"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js",array('jquery'),"4.0.6",true);

  
  // Different pages have additional scripts, so this section asks what template we're using and then queues the correct scripts for that page.
  //if template is soilsdash, enqueue the js file
  if(is_page_template('page-templates/page-template-soilsdash.php')) {

    wp_enqueue_script( 'soils-script', plugin_dir_url( __FILE__ ) . 'js/soils.js', array( 'jquery' ), time(), true );

    //Setup the parameters for "localising" the javascript. (i.e. passing values into the javascript)
    $params = array(
      'editorurl' => plugin_dir_url(__FILE__) . 'ajax',
      'ajaxurl' => admin_url( 'admin-ajax.php' ),
      'pa_nonce' => wp_create_nonce('pa_nonce')
    );

    //localise!
    wp_localize_script('soils-script','vars',$params);
  } // end if(is soils-dash)

  //if template is communities...
  if(is_page_template('page-templates/page-template-communities.php')) {

    wp_enqueue_script( 'communities-script', plugin_dir_url( __FILE__ ) . 'js/communities.js', array( 'jquery' ), time(), true );
    wp_enqueue_script( 'farms-script', plugin_dir_url( __FILE__ ) . 'js/farms.js', array( 'jquery' ), time(), true );

    //Setup the parameters for "localising" the javascript. (i.e. passing values into the javascript)
    $params = array(
      'editorurl' => plugin_dir_url(__FILE__) . 'ajax',
      'ajaxurl' => admin_url( 'admin-ajax.php' ),
      'pa_nonce' => wp_create_nonce('pa_nonce')
    );

    //localise!
    wp_localize_script('communities-script','vars',$params);
    wp_localize_script('farms-script','vars',$params);

    //Mustache and QR code dependancies
    wp_enqueue_script( 'mustache-script', plugin_dir_url( __FILE__ ) . 'js/mustache.js/mustache.min.js', array( 'jquery' ), time(), true );
    wp_enqueue_script( 'qr-script', plugin_dir_url( __FILE__ ) . 'js/qrcodejs/qrcode.min.js', array( 'jquery' ), time(), true );
    wp_enqueue_script( 'jqueryprint-script', plugin_dir_url( __FILE__ ) . 'js/jquery-print.js', array( 'jquery' ), time(), true );

  }

    //if template is soils...
  if(is_page_template('page-templates/page-template-soilsdash.php')) {

    wp_enqueue_script( 'soils-script', plugin_dir_url( __FILE__ ) . 'js/soils.js', array( 'jquery' ), time(), true );
    // wp_enqueue_script( 'print-js-script','https://printjs-4de6.kxcdn.com/print.min.js', array( 'jquery' ), time(), true );
    // wp_enqueue_style( 'print-js-style', 'https://printjs-4de6.kxcdn.com/print.min.css',array(),"4.7" );

    //also enqueue the print-js scripts:
    

    //Setup the parameters for "localising" the javascript. (i.e. passing values into the javascript)
    $params = array(
      'editorurl' => plugin_dir_url(__FILE__) . 'ajax',
      'ajaxurl' => admin_url( 'admin-ajax.php' ),
      'pa_nonce' => wp_create_nonce('pa_nonce'),
      'user_id' => BP_Groups_Member::get_group_ids( get_current_user_id())
    );

    //localise!
    wp_localize_script('soils-script','vars',$params);
    wp_localize_script('communities-script','vars',$params);
    wp_localize_script('farms-script','vars',$params);

  }
}

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



add_action('wp_ajax_get_barcodes', 'get_barcodes');
add_action('wp_ajax_nopriv_get_barcodes','get_barcodes');
function get_barcodes() {
  GLOBAL $wpdb, $qrcodetag;
  $soilsdb = new wpdb('root','ssd@soils-dev','soils','localhost');

  $community_id = $_POST['community_id'];

  $sql = "SELECT * FROM `barcodes` WHERE `community_id`=" . $community_id;
  $query = $soilsdb->query($sql);
  if($query == 0) {
    //then no barcodes were found for this community;
    wp_send_json_success("0");
  }
  else {
    $results = $soilsdb->get_results($sql);
    //go through results and add the QR code url:
    for($x = 0;$x < sizeof($results);$x++) {
      $results[$x]->url = $qrcodetag->getQrCodeUrl($results[$x]->code,100,'UTF-8','L',4,0);
    }
    wp_send_json_success(json_encode($results));
  }

} //end get_barcodes()

//get single barcode from string
add_action('wp_ajax_get_single_barcode', 'get_single_barcode');
add_action('wp_ajax_nopriv_get_single_barcode','get_single_barcode');
function get_single_barcode() {
    GLOBAL $qrcodetag;
  $value = $_POST['value'];

  $result = $qrcodetag->getQrCodeUrl($value,100,'UTF-8','L',4,0);
  wp_send_json_success($result);
} // end get single barcode. 


add_action('wp_ajax_create_barcode','create_barcode');
add_action('wp_ajax_nopriv_create_barcode','create_barcode');
function create_barcode() {
  GLOBAL $wpdb;

  $farm = $_POST['farm'];
  $number = $_POST['number'];

  $query = [];
  $ids = [];
  //generate the number of barcodes asked for:
  for($i = 0; $i<$number; $i++){
  // //create entry in barcodes table (to generate an auto-increment value);
  $query[] = $wpdb->insert('barcodes',array('farm_id' => $farm, 'status'=>"gen"));
    //get the ID of the inserted row:
    $id[] = $wpdb->insert_id;
  }

  //then, run update command to turn the newly 'gen'-ed AI into a code that can be barcoded. This code will include the country and community IDs

  $updateQuery = $wpdb->get_results("
                                       UPDATE `barcodes` 
                                       SET `barcodes`.`code` = CONCAT(`farm_id`,`barcodes`.`id`), `barcodes`.`status`='coded' 
                                       WHERE `barcodes`.`status`='gen'");
  for($j=0;$j<$number;$j++){
    $id[$j] = $farm . $id[$j];
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