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
<div class='alert alert-info'>
  <p>This page displays soil sample data for samples your project has collected. Any analysis data will also be available. If a particular analyis has not been conducted, those fields will be blank for the sample.</p>
  <p>To show or hide analysis results, use the "show/hide columns" button at the top of the table. You can download the sample data to a csv file for use in Excel or statistics package locally.</p>
  <p>Note: This page only shows sample information for your project's samples.</p>
</div>

<?php 
  if(get_current_user_id()!=1) {
    ?>
    <pre>Page coming soon</pre>
    <?php 
  }

  else {
    ?> 
    <table id='DataTable' class='table table-striped'></table>
  <?php }
  ?>

        <?php get_template_part( 'content', 'page' ); ?>



      <?php endwhile; // end of the loop. ?>

    </main><!-- #main -->

  </div><!-- #primary -->

<?php get_footer(); ?>
