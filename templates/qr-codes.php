<?php
/**
 * Template Name: qr-codes
 *
 * This is the template that displays full width page without sidebar
 *
 * @package sparkling-child
 */

get_header(); ?>

  <div id="primary" class="content-area">

    <main id="main" class="site-main" role="main">

      <?php while ( have_posts() ) : the_post(); ?>


<h1>Generate QR Codes</h1>
<div class='alert alert-info'>
  <p>Use this page to generate QR codes that aren't linked to a specific location or farmer. This is used if you are getting quickly setup, or are mainly using the toolkit to aid with analysis of samples, and are managing your data elsewhere.</p>
  <p>Click the button below to generate a sheet of 6 sample codes for printing. Every code will be unique within the system. Simply generate and print as many sheets as you need for your work.
</div>

<button onclick="getCodes(6)">Generate Code Sheet for printing</button>
<div id='sample_sheet'></div>

        <?php get_template_part( 'content', 'page' ); ?>



      <?php endwhile; // end of the loop. ?>

    </main><!-- #main -->

  </div><!-- #primary -->

<?php get_footer(); ?>
