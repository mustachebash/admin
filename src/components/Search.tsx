import React, { useState } from 'react';

interface SearchProps {
	handleQueryChange: (query: string) => void;
}

const Search = ({ handleQueryChange }: SearchProps) => {
	const [query, setQuery] = useState('');

	function onQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
		setQuery(e.target.value);
		handleQueryChange(e.target.value);
	}

	return (
		<div className="search">
			<aside>
				<input type="text" value={query} onChange={onQueryChange} placeholder="Search..." />
			</aside>
		</div>
	);
};

export default Search;
