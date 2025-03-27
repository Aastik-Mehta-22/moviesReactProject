import React from 'react'

const MovieCard = ({ movie: { title, vote_average, poster_path, release_date, original_language, overview ,popularity } }) => {
    
    const truncatedOverview = overview && overview.length > 150 
    ? overview.substring(0, 150) + "..." 
    : overview;

    return (
    <div className="movie-card">
      <div className="movie-inner">
        
        {/* Front Side */}
        <div className="movie-front">
          <img 
            src={poster_path ? 
                `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'} 
            alt={title}
            className="movie-image"
          />

          <div className="movie-content">
            <h3 className="text-lg font-semibold">{title}</h3>

            <div className='content flex items-center gap-2 text-gray-300'>
                <div className="rating flex items-center gap-1">
                    <img src="star.svg" alt="Star Icon" className="w-4 h-4"/>
                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                </div>

                <span>•</span>
                <p className='lang uppercase'>{original_language}</p>
                <span>•</span>
                <p className='year'>
                    {release_date ? release_date.split('-')[0] : 'N/A'}
                </p>
            </div>
          </div>
        </div>

        {/* Back Side (Flips on Hover) */}
        
  

        
        <div className="movie-back flex flex-col">
          <p className="overview-text">{truncatedOverview ? truncatedOverview : "No overview available"}</p>
            <h4 className='font-bold text-yellow-500'> Popularity : {popularity ? Math.round(popularity) : "No popularity available"} </h4>
        </div>
        
      </div>
    </div>
  )
}

export default MovieCard;
