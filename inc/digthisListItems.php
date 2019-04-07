<?php

class digthisListItems {
	public static $instance;
	private $posts_per_page = 6;

	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	public function __construct() {
		add_shortcode( 'jso_list_items', array( $this, 'jso_list_items_shortcode' ) );
		add_action( 'wp_ajax_nopriv_digthis_get_items', array( $this, 'get_items' ) );
		add_action( 'wp_ajax_digthis_get_items', array( $this, 'get_items' ) );
	}

	public function get_items() {
		/*
		 * Filter Params
		 * Pagination
		 * Tax Query
		 */
		$query_args      = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'posts_per_page' => $this->posts_per_page
		);
		$filter_defaults = array(
			'search_term' => false,
		);

		$filter_options = filter_input( INPUT_POST, 'filters', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		$filter_options = array_merge( $filter_defaults, $filter_options );

		if ( ! empty( $filter_options['search_term'] ) ) {
			$query_args['s'] = esc_html( $filter_options['search_term'] );
		}

		$items       = new WP_Query( $query_args );
		$posts_found = $items->found_posts;
		$list_html   = '';
		if ( $items->have_posts() ):
			while ( $items->have_posts() ): $items->the_post();
				ob_start();
				get_template_part( 'template-parts/digthis-list-item' );
				$list_html .= ob_get_clean();
			endwhile;
			wp_reset_postdata();
		else:
			wp_send_json_error( array( 'message' => 'No Posts Found' ) );
		endif;

		$response = array( 'listHTML' => $list_html, 'posts_found' => $posts_found );
		wp_send_json_success( $response );

	}

	public function get_pagination( $query, $atts ) {

		$paged = get_query_var( 'paged' );
		if ( $atts['show_page'] ) {
			$paged = (int) $atts['show_page'];
		}

		$big = 999999999; // need an unlikely integer

		// do this if only, it is coming from ajax call
		// to confirm, check if base_page
		// problem: https://stackoverflow.com/questions/20150653/wordpress-pagination-not-working-with-ajax

		$page_link = esc_url( get_pagenum_link( $big ) );
		if ( wp_doing_ajax() && $atts['base_page'] ) {
			$base         = $atts['base_page'];
			$orig_req_uri = $_SERVER['REQUEST_URI'];

			// Overwrite the REQUEST_URI variable
			$_SERVER['REQUEST_URI'] = $base;

			$page_link = esc_url( get_pagenum_link( $paged ) );

			// Restore the original REQUEST_URI - in case anything else would resort on it
			$_SERVER['REQUEST_URI'] = $orig_req_uri;
		}


		$pagination_args = array(
			'base'      => str_replace( $big, '%#%', $page_link ),
			'format'    => '?paged=%#%',
			'current'   => max( 1, $paged ),
			'total'     => $query->max_num_pages,
			'type'      => 'list',
			'prev_next' => false

		);

		return paginate_links( $pagination_args );

	}

	public function jso_list_items_shortcode() {
		$paged     = ( get_query_var( 'paged' ) ) ? absint( get_query_var( 'paged' ) ) : 1;
		$args      = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'posts_per_page' => $this->posts_per_page,
			'paged'          => $paged
		);
		$listItems = new WP_Query( $args );
		ob_start();
		if ( $listItems->have_posts() ):
			?>
            <div class='digthis-list-container'>
                <div class="filter-items">
                    <form>
                        <input type="text" class="search" name="search" placeholder="search" autocomplete="off"/>
                        <input type="submit" value="search">
                    </form>
                </div>
                <div class="pagination">
					<?php echo $this->get_pagination( $listItems, 1 ); ?>
                </div>
                <div class="item-container">
					<?php
					while ( $listItems->have_posts() ): $listItems->the_post();
						get_template_part( 'template-parts/digthis-list-item' );
					endwhile;
					wp_reset_postdata();
					?>
                </div>
            </div>
		<?php
		endif;

		return ob_get_clean();
	}
}

digthisListItems::get_instance();