<?php
/**
 * Template Name: soilsdash
 *
 * This is the template that displays full width page without sidebar
 *
 * @package sparkling-child
 */

get_header(); ?>

  <div id="primary" class="content-area">

    <main id="main" class="site-main" role="main">

      <?php while ( have_posts() ) : the_post(); ?>


<h1>Soil Sample Data</h1>
<h4>Projects</h4>
<p>Data is currently shown for your project(s): <span class='font-weight-bold' id="project_list"></span>
<div class='alert alert-info'>
  <p>This page displays soil sample data for samples your project has collected. Any analysis data will also be available. If a particular analyis has not been conducted, those fields will be blank for the sample.</p>
  <p>To show or hide analysis results, use the "show/hide columns" button at the top of the table. You can download the sample data to a csv file for use in Excel or statistics package locally.</p>
  <hr/>
  <p>The data below may not include recent submissions. To manually sync the data from Kobotools, click the button below.</p>
  <div id='update_records_button'></div>
</div>

<div style='display:none;'>
  <table id="projects_table"></table>
</div>
<!--   <div id='filters' class='card'>
    <div class="card-header">
      <h4>Table Filters</h4>
    </div>
    <div class="card-body">
      <form id='filterDiv' class='form form-horizontal'>
        <div class='row'>
          <div class='col-sm-3'>
            <label class='control-label'>Select Project</label>
          </div>
          <div class='col-sm-8'>
            <div id='district_projectFilter'></div>
          </div>
        </div>
      </form>
    </div>
  </div> -->

<table id='DataTable' class='table table-striped'></table>


        <?php get_template_part( 'content', 'page' ); ?>



      <?php endwhile; // end of the loop. ?>

    </main><!-- #main -->

  </div><!-- #primary -->

<?php get_footer(); ?>
