<?php
add_action( 'wp_enqueue_scripts', 'twentynine_enqueue_styles' );
function twentynine_enqueue_styles() {

	$parent_style = 'parent-style'; // This is 'twentyfifteen-style' for the Twenty Fifteen theme.
	$ver          = wp_get_theme()->get( 'Version' );

	/*Dont Want Navigation.js*/
	


	wp_register_style( $parent_style, get_template_directory_uri() . '/style.css' );
	wp_enqueue_style( 'child-style',
		get_stylesheet_directory_uri() . '/css/main.css',
		array( $parent_style ),
		$ver
	);

	wp_register_script( 'child-script', get_stylesheet_directory_uri() . '/js/main.js', array( 'jquery' ), $ver );
	wp_enqueue_script( 'child-script' );
	$data = array(
		'ajaxUrl' => admin_url( 'admin-ajax.php' )
	);
	wp_localize_script( 'child-script', 'JSC', $data );
}

add_action('wp_enqueue_script','derigester_parent_theme_styles',999);
function derigester_parent_theme_styles(){
	wp_deregister_style('twentyseventeen-navigation');
	wp_dequeue_style('twentyseventeen-navigation');
}

require_once( get_stylesheet_directory() . '/inc/digthisListItems.php' );

function js_code_organization_back_to_top(){
	?>
	<a href="#" id="back-to-top">Top</a>
	<?php
}
add_action('wp_footer','js_code_organization_back_to_top');