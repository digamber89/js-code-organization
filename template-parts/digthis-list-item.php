<?php
/*Template Part For List Items View for Shortcode*/
?>
<div class="list-item">
	<div class="item-image">
		<?php
		if ( has_post_thumbnail() ) {
			the_post_thumbnail( 'medium' );
		} else {
			echo '<img src="https://via.placeholder.com/300" width="300" height="300" />';
		}
		?>
	</div>
	<div class="item-details">
		<h2><?php the_title(); ?></h2>
		<a href="<?php the_permalink(); ?>">View Details</a>
	</div>
</div>