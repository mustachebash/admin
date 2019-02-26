import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

export default class PromosListItem extends Component {
	constructor(props) {
		super(props);

		this.disablePromo = this.disablePromo.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.promo !== this.props.promo;
	}

	disablePromo() {
		// eslint-disable-next-line no-alert
		if(confirm('Are you sure you want to remove this promo? This cannot be undone')) this.props.disablePromo(this.props.promo.id);
	}

	render() {
		const { promo, product, event } = this.props;

		return (
			<React.Fragment>
				<li className="promo">
					<div className="status">
						<span
							className={promo.status === 'claimed' ? 'checked' : ''}
							title={promo.status === 'claimed' ? moment.tz(promo.updated, 'America/Los_Angeles').format('MMM Do, h:mma') : 'Not Claimed'}
						>
							{promo.status}
						</span>
					</div>
					<div className="recipient">
						<p>{promo.recipient}</p>
					</div>
					<div className="date">
						<p>{moment.tz(promo.created, 'America/Los_Angeles').format('MMM Do, h:mma')}</p>
					</div>
					<div className="event">
						<p>{event.name}</p>
					</div>
					<div className="product">
						<p title={`$${promo.price} - ${promo.createdBy}`}>{product.name}</p>
					</div>
					<div className="link">
						<p><a href={`https://mustachebash.com/?promo=${promo.id}#tickets`} rel="noopener noreferrer" target="_blank">Promo Link</a></p>
					</div>
					<div className="edit-promo">
						<p>{!['claimed', 'disabled'].includes(promo.status) && <a href="#" onClick={this.disablePromo}>&#x274C;</a>}</p>
					</div>
				</li>
			</React.Fragment>
		);
	}
}

PromosListItem.propTypes = {
	product: PropTypes.object.isRequired,
	event: PropTypes.object.isRequired,
	promo: PropTypes.object.isRequired,
	disablePromo: PropTypes.func.isRequired
};
