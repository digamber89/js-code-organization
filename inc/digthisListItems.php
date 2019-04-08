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
		$filter_options = filter_input( INPUT_POST, 'filters', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		//$filter_options = array_merge( $filter_defaults, $filter_options );

		$paged      = 1;
		$pagination = '';
		$list_html  = '';
		$query_args = array(
			'post_type'           => 'post',
			'post_status'         => 'publish',
			'posts_per_page'      => $this->posts_per_page,
			'paged'               => $paged,
			'ignore_sticky_posts' => 1
		);

		if ( ! empty( $filter_options['search_term'] ) ) {
			$query_args['s'] = esc_html( $filter_options['search_term'] );
		}

		if ( ! empty( $filter_options['show_page'] ) ) {
			$query_args['paged'] = $filter_options['show_page'];
		}

		if ( ! empty( $filter_options['category_id'] ) ) {
			$query_args['tax_query'] = array(
			        array(
			                'taxonomy' => 'category',
                             'terms' => $filter_options['category_id']
                    )
            );

                $filter_options['category_id'];
		}

		$items = new WP_Query( $query_args );

		$pagination = $this->get_pagination( $items, $filter_options );

		$posts_found = $items->found_posts;
		if ( $items->have_posts() ):
			while ( $items->have_posts() ): $items->the_post();
				ob_start();
				get_template_part( 'template-parts/digthis-list-item' );
				$list_html .= ob_get_clean();
			endwhile;
			wp_reset_postdata();
		else:
			wp_send_json_error( array( 'message' => '<div class="nothing-found"><h3>Sorry, Nothing to see here</h3></div>' ) );
		endif;

		$response = array(
			'listHTML'    => $list_html,
			'posts_found' => $posts_found,
			'pagination'  => $pagination
		);

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
			//print_r($atts); die;
			$page_link = esc_url( get_pagenum_link( $big ) );

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
		global $post;
		$paged     = ( get_query_var( 'paged' ) ) ? absint( get_query_var( 'paged' ) ) : 1;
		$args      = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'posts_per_page' => $this->posts_per_page,
			'paged'          => $paged
		);
		$listItems = new WP_Query( $args );
		$base_url  = get_permalink( $post );
		ob_start();
		?>
        <div class='digthis-list-container' data-baseurl="<?php echo $base_url ?>">
            <div class="filter-items">
                <form>
                    <input type="text" class="search" name="search" placeholder="search" autocomplete="off"/>
                    <input type="submit" value="search">
                </form>
            </div>
            <div class="pagination">
				<?php echo $this->get_pagination( $listItems, 1 ); ?>
            </div>
            <div class="item-filters">
                <label for="category">
                    Select Category
                </label>
                <select name="category" id="category">
					<?php
					$args  = array(
						'taxonomy'   => 'category',
						'hide_empty' => false
					);
					$terms = get_terms( $args );
					echo '<option value="">All</option>';
					foreach ( $terms as $term ) {
					    echo '<option value="'.$term->term_id.'">'.$term->name.'</option>';
					}
					?>
                </select>
            </div>
            <div class="item-container">
				<?php
				if ( $listItems->have_posts() ):
					while ( $listItems->have_posts() ): $listItems->the_post();
						get_template_part( 'template-parts/digthis-list-item' );
					endwhile;
					wp_reset_postdata();
				else:
					?>
                    <div class="nothing-found"><h3>Sorry, Nothing to see here</h3></div>
				<?php
				endif;
				?>
            </div><!--item-container-->
        </div><!--digthis-list-container-->
		<?php
		return ob_get_clean();
	}
}

digthisListItems::get_instance();