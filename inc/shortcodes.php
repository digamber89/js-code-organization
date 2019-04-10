<?php
function digthis_slick_slider() {
	$args   = array(
		'post_type'      => 'slide',
		'posts_per_page' => 6,
	);
	$slides = new WP_Query( $args );
	//var_dump($slides->found_posts);
	ob_start();
	if ( $slides->have_posts() ):
		?>
        <div class="digthis-slick-slider">
			<?php
			while ( $slides->have_posts() ): $slides->the_post();
				?>
                <div><?php the_post_thumbnail(); ?></div>
			<?php
			endwhile;
			wp_reset_postdata();
			?>
        </div>
	<?php
	endif;
	return ob_get_clean();
}

add_shortcode( 'digthis_slick_slider', 'digthis_slick_slider' );