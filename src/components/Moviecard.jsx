import React from 'react';

const Moviecard = ({ movie:
    { title, vote_average, poster_path, release_date, original_language }
}) => {
    return (
        <>
            <div className='movie-card'>
                <img src={poster_path ?
                    `https://image.tmdb.org/t/p/w500/${poster_path}` :
                    '/No-Poster.png'
                } alt="title" />
                <h3>{title}</h3>
                <div className='content'>
                    <div className='rating'>
                        <img src="/star.svg" alt="star" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>
                    <span>•</span>

                    <span>{original_language}</span>

                    <span>•</span>

                    <span>{release_date ? release_date.split('-')[0] : 'N/A'}</span>
                </div>
            </div>
        </>
    );
}

export default Moviecard;
