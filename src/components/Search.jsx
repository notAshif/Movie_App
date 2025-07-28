import React from 'react';

const Search = ({ searchItem, setSearchItem }) => {
    return (
        <>
            <div className='search'>
                <div>
                    <img src="/search.svg" alt="search" />
                    <input type="text" placeholder="Search Through 300+ Movies online" value={searchItem} onChange={(e) => setSearchItem(e.target.value)} />
                </div>
            </div>
        </>
    );
}

export default Search;
