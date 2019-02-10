import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { fetchProducts } from 'products/productsDuck';
import { fetchPromos, addPromo, updatePromo, disablePromo } from '../promosDuck';
import PromosList from '../components/PromosList';
import CreatePromoForm from '../components/CreatePromoForm';
import Search from 'components/Search';

export class PromosTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			filter: '',
			sortBy: 'recipient',
			sortOrder: 1 // asc
		};

		this.sortPromos = this.sortPromos.bind(this);
		this.switchPromosOrder = this.switchPromosOrder.bind(this);
		this.handleFilterChange = this.handleFilterChange.bind(this);
	}

	componentDidMount() {
		this.props.fetchProducts();
		this.props.fetchPromos();
	}

	componentDidUpdate(prevProps) {
		if((prevProps.selectedEvents !== this.props.selectedEvents && this.props.selectedEvents.length) ||
			(!prevProps.socketConnected && this.props.socketConnected)
		) {
			this.props.fetchPromos({eventId: this.props.selectedEvents});
		}
	}

	getPromoComparator() {
		return (a, b) => {
			let sort = 0;

			switch(this.state.sortBy) {
				case 'date':
					// This will (should) never be the same
					sort = a.created > b.created ? 1 : -1;
					break;

				default:
				case 'recipient':
					sort = a.recipient > b.recipient
						? 1
						: a.recipient === b.recipient
							? 0
							: -1;
					break;
			}

			return sort * this.state.sortOrder;
		};
	}

	sortPromos(sortBy) {
		this.setState({
			sortOrder: 1,
			sortBy
		});
	}

	switchPromosOrder() {
		this.setState({
			sortOrder: this.state.sortOrder * (-1)
		});
	}

	handleFilterChange(q) {
		this.setState({
			filter: q
		});
	}

	render() {
		const events = this.props.events.filter(e => this.props.selectedEvents.includes(e.id)),
			products = this.props.products.filter(p => this.props.promoProducts.includes(p.id)),
			filter = new RegExp(this.state.filter, 'i');

		let promos = this.props.promos.filter(p => {
			if(!this.state.filter) return true;

			return (
				filter.test(p.recipient) ||
				filter.test(p.email)
			);
		});

		promos = promos.sort(this.getPromoComparator());

		// No one needs to see more than 100 promos at a time
		promos = promos.slice(0, 100);

		return (
			<React.Fragment>
				<h4>Create a Promo</h4>
				<CreatePromoForm events={events} products={products} addPromo={this.props.addPromo}/>

				<Search handleQueryChange={this.handleFilterChange} />

				<p>Showing {promos.length} of {this.props.promos.length} total</p>

				<PromosList
					user={this.props.user}
					promos={promos}
					events={events}
					products={products}
					sortPromos={this.sortPromos}
					switchPromosOrder={this.switchPromosOrder}
					sortBy={this.state.sortBy}
					sortOrder={this.state.sortOrder}
					disablePromo={this.props.disablePromo}
				/>
			</React.Fragment>
		);
	}
}

PromosTable.propTypes = {
	user: PropTypes.object.isRequired,
	promos: PropTypes.array.isRequired,
	events: PropTypes.array.isRequired,
	products: PropTypes.array.isRequired,
	fetchPromos: PropTypes.func.isRequired,
	addPromo: PropTypes.func.isRequired,
	updatePromo: PropTypes.func.isRequired,
	fetchProducts: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
	user: state.session.user,
	promos: state.data.promos,
	events: state.data.events,
	products: state.data.products,
	promoProducts: state.control.promoProducts,
	selectedEvents: state.control.selectedEvents
});

export default connect(mapStateToProps, {
	fetchPromos,
	fetchProducts,
	addPromo,
	updatePromo,
	disablePromo
})(PromosTable);
