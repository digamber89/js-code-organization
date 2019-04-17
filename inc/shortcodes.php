<?php

class digthisSlickSlider {
	public static $count = 0;

	public function __construct() {
		add_shortcode( 'digthis_slick_slider', array( $this, 'init_slider' ) );
	}

	public function json_escape( $json, $html = false ) {
		return _wp_specialchars(
			$json,
			$html ? ENT_NOQUOTES : ENT_QUOTES, // Escape quotes in attribute nodes only,
			'UTF-8',                           // json_encode() outputs UTF-8 (really just ASCII), not the blog's charset.
			true                               // Double escape entities: `&amp;` -> `&amp;amp;`
		);
	}

	public function init_slider( $atts ) {
		global $post;
		$slider = shortcode_atts( array(
			'id'            => '',
			'slidesperpage' => '1',
			'arrows'        => 'true',
			'dots'          => 'false'
		), $atts );


		$sliderOptions = [
			'arrows'       => ( $slider['arrows'] == 'true' ) ? true : false,
			'dots'         => ( $slider['dots'] == 'true' ) ? true : false,
			'slidesToShow' => $slider['slidesperpage']
		];

		$content        = '';
		$sliderSettings = wp_json_encode( $sliderOptions );

		//$slides = get_post( $args );
		if ( empty( $slider['id'] ) ) {
			$content .= 'No Slider Found';

			return $content;
		} else {
			$post = get_post( $slider['id'] );
			setup_postdata( $post );
			ob_start();
			$images = get_field( 'gallery' );
			echo '<div class="digthis-slick-slider digthis-slick-slider-' . self::$count . '" 
			data-slider_settings="' . $this->json_escape( $sliderSettings ) . '" 
			 >';
			foreach ( $images as $image ) {
				echo '<div>' . wp_get_attachment_image( $image['id'] ) . '</div>';
			}

			wp_reset_postdata();
			echo '</div>';
			?>
            <script>
                jQuery(function ($) {
                    //can replace .digthis-slick-slider with a unique ID if we create a class and have all slick slider remmber that id
                    $('body').trigger('digthis-slick-init', ['<?php echo '.digthis-slick-slider-' . self::$count; ?>']);
                });
            </script>
			<?php
			$content .= ob_get_clean();
		}

		self::$count += 1;

		return $content;
	}
}

$digthisSlickSlider = new digthisSlickSlider();
