<?php
/**
 * Template Name: communities
 *
 * This is the template that displays full width page without sidebar
 *
 * @package sparkling-child
 */

acf_form_head();
get_header(); ?>

  <div id="primary" class="content-area">

    <main id="main" class="site-main" role="main">

      <?php while ( have_posts() ) : the_post(); ?>

<!-- ########################## -->
<!-- ########################## -->
<!-- ########################## -->
<!-- Main Page Contents go here -->

<?php 

// Get current users' group(s):
$groupid = BP_Groups_Member::get_group_ids( get_current_user_id());

// check how many groups user is a member of:


if(count($groupid[groups]) == 0 ) {
echo "<div class='alert alert-warning'>Hello. Thank you for registering on the site. You need to be invited to one of the active projects before viewing this page. Please contact your project administrator.<br/><br/> For more information, please contact support@stat4sd.org.</div>";
die();
}

if(count($groupid[groups]) == 1) {
//use current() to get the first entry int the groupid array. 
// This only works if a member is part of ONLY 1 group. 
$this_id = current($groupid[groups]);

if($this_id == 3) {
  $district = "ward";
  $community = "VBA";
  $farm = "farm";
  $plot = "terrace";
}

else {
  $district = "district";
  $community = "community";
  $farm = "farm";
  $plot = "plot";
}

//echo "<pre>user is member of 1 group => group id = " . $this_id . "</pre>";

}

if(count($groupid[groups]) > 1) {
  
  foreach($groupid[groups] as $group) {
    $this_id = $group;
    //echo "<pre>user group id = " . $this_id . "</pre>";

  }
}

?>

<h1>Location Management</h1>
<div class='alert alert-info'>
  <p>This page allows you to add and update data about the places you are collecting soil samples. This system is currently done per-project, so for now you will see your project's communities available on this page.</p>
  <p>Use the tabbed interface below to review the list of locations, and add any new ones that you need for your project.</p>
  <p>NOTE: At the moment, you can see results from your project (FIPS), plus results from the testing work of Research Methods Support and the Soils Cross-cutting project. These testing results will eventually be removed to let you focus fully on locations relevant to your own project. For now, you can use the filters in the table to see only locations relevant to your project.</p>

</div>

<div role="tabpanel">
  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">

    <li role="presentation" class="">
      <a href="#districts" aria-controls="districts" role="tab" data-toggle="tab"><?php echo $district;?></a>
    </li>
    <li role="presentation" class="active">
      <a href="#communities" aria-controls="communities" role="tab" data-toggle="tab"><?php echo $community;?></a>
    </li>
    <li role="presentation">
      <a href="#farms" aria-controls="farms" role="tab" data-toggle="tab"><?php echo $farm;?></a>
    </li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">

    <!-- ########### Districts ########### -->
    <div role="tabpanel" class="tab-pane" id="districts">

      <!-- #### TAB CONTENT ### -->
      <div id='filters' class='well well-sm' style='margin-top: 15px;'>
        <h4>Table Filters</h4>
        <form id='filterDiv' class='form form-horizontal'>
          <div class='form-group'>
            <div class='col-sm-3'>
              <label class='control-label'>Select Project</label>
            </div>
            <div class='col-sm-8'>
              <div id='district_projectFilter'></div>
            </div>
          </div>
        </form>
      </div>

      <table id="districtTable" class='table table-striped table-bordered'></table>
    </div>

    <!-- ########### Communities ########### -->
    <div role="tabpanel" class="tab-pane active" id="communities">

      <!-- #### TAB CONTENT ### -->
      <div class='alert alert-info'>
        <h3>How to use</h3>
        <ul class="">
          <li class=""><strong>Add New <?php echo $community; ?></strong>: Click "new" and enter the community details in the pop-up form.</li>
          <li class=""><strong>Edit <?php echo $community; ?> Details</strong>: Click on a community in the table to highlight it. Then click the "Edit" button. Edits are synced to the database when you click "submit" in the pop-up form.</li>
        </ul>
      </div>
      <div id='filters' class='well well-sm' style='margin-top: 15px;'>
        <h4>Table Filters</h4>
        <form id='filterDiv' class='form form-horizontal'>
          <div class='form-group'>
            <div class='col-sm-3'>
              <label class='control-label'>Select Project</label>
            </div>
            <div class='col-sm-8'>
              <div id='community_projectFilter'></div>
            </div>
          </div>
          <div class='form-group'>
            <div class='col-sm-3'>
              <label class='control-label'>Select <?php echo $district ?></label>
            </div>
            <div class='col-sm-8'>
              <div id='community_districtFilter'></div>
            </div>
          </div>
        </form>
      </div>

      <table id="communityTable" class='table table-striped table-bordered'></table>
    </div>

    <!-- ########### FARMS ########### -->
    <div role="tabpanel" class="tab-pane" id="farms">
      <div id='filters' class='well well-sm' style='margin-top: 15px;'>
        <h4>Table Filters</h4>
        <form id='filterDiv' class='form form-horizontal'>
          <div class='form-group'>
            <div class='col-sm-3'>
              <label class='control-label'>Select Project</label>
            </div>
            <div class='col-sm-8'>
              <div id='farm_projectFilter'></div>
            </div>
          </div>
           <div class='form-group'>
            <div class='col-sm-3'>
              <label class='control-label'>Select <?php echo $community; ?></label>
            </div>
            <div class='col-sm-8'>
              <div id='farm_communityFilter'></div>
            </div>
          </div>
        </form>
      </div>

      <table id="farmTable" class='table table-striped table-bordered'></table>
    </div>
         
  </div>
</div>



<!-- Main page contents end here  -->
<!-- ########################## -->
<!-- ########################## -->
<!-- ########################## -->

      <?php endwhile; // end of the loop. ?>

    </main><!-- #main -->

  </div><!-- #primary -->

<?php get_footer(); ?>
