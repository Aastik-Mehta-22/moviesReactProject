import { useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Search from './components/Search'
import './App.css'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite'

const API_BASE_URL= 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {

  const [searchTerm,setSearchTerm] = useState('');
  const [errorMessage,setErrorMessage] = useState('');
  const [movieList,setMovieList] = useState([]);
  const [trendingMovies,setTrendingMovies] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [debouncedSearchTerm,setDebouncedSearchTerm] = useState('');

  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);



  const fetchMovies = async (query = '') => {

    setIsLoading(true);
    setErrorMessage('');

    try {
      
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint,API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');

      }

      const data = await response.json();
      

      if (data.response === 'FALSE') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      console.log(data)

      setMovieList(data.results || []);
      
      if(query && data.results.length > 0){
        await updateSearchCount(query,data.results[0]);
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies.Please try again later.');
    } finally {
        setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {

      try {
        
        const movies = await getTrendingMovies();
        setTrendingMovies(movies)
      } catch (error) {
        
        console.error(`Error fetching trending movies ${error}`);
      
      }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  },[debouncedSearchTerm])

  useEffect(() => {
    loadTrendingMovies();
  },[])

  return (
    
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle ✨</h1>
          <Search searchTerm={searchTerm} setSearchterm={setSearchTerm}/>
        </header>
        
        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2 className='text-gradient'>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie,index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ) )}
            </ul>
          </section>
        )}


        <section className='all-movies'>
            <h2 className='text-gradient'>All Movies</h2>
              
            {isLoading ? (

              <Spinner />
            ) : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )}

        </section>
      </div>


    
    </main>
  )
}

export default App
