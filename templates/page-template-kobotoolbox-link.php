<?php
/**
 * Template Name: kobotoolbox-link
 *
 * This is the template that displays full width page without sidebar
 *
 * @package sparkling-child
 */

get_header(); ?>

  <div id="primary" class="content-area">

    <main id="main" class="site-main" role="main">

      <?php while ( have_posts() ) : the_post(); ?>


        <h1>Kobotools Form Management </h1>
        <div class='alert alert-info text-dark p-4'>
          <p>Use this page to add the CCRP-Soils intake and analysis forms to your own Kobotools account. Follow the instructions below to setup the forms for data collection</p>

          <h4>Project(s) you are assigned to:</h4>
          <div id="project_list"></div>
          <p>The table below shows all the available soils forms for every project you are assigned to.</p>
          <p>There are currently 4 soils forms, so you should see 4 rows for each project below. Each form also shows whether it is deployed to your project's Kobotoolbox account or not.</p>
          <h5>Things to do:</h5>
          <ol>
            <li>Check that your project(s) have the correct kobotoolbox account names assgined</li>
            <li>Deploy the forms using the links in the table.</li>
            <li>(optional) - Use the Location Managemnt page to define your districts, villages and farmers</li>
            <li>Use either the Location Management or Soils Codes page to generate QR codes for your soil samples</li>
          </ol>
          <p>Once you have done these things, you will be ready to collect your samples using the intake form, and run your analyses using the analysis forms</p>
          <p>Deploying a form will create a new version of that form. The form will be owned by the soils_ccrp kobo account, and shared with full access to your project's account so you can start collecting data straight away</p>
          <p>
        </div>
        
        <table id='DataTable' class='table table-striped'></table>

    <button onclick="testLoc()">TEST LOCATION</button>

      <?php endwhile; // end of the loop. ?>

    </main><!-- #main -->

  </div><!-- #primary -->

<?php get_footer(); ?>
