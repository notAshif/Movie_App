import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import Moviecard from "./components/Moviecard";
import { updateSearchCount, getTrendingMovies } from "./appwrite";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_OPTION = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [debounceSearchItem, setDebounceSearchItem] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(
    () => {
      setDebounceSearchItem(searchItem);
    },
    500,
    [searchItem]
  );


  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTION);

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();

      if (data.response === "false") {
        setErrorMessage(data.results || 'Not Found Movies. Please try again.');
        setMoviesList([]);
        return
      }

      setMoviesList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.log(error);
      setErrorMessage('Not Found Movies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(debounceSearchItem);
  }

  const loadTrendingMovies = async () => {
    try {
      const result = await getTrendingMovies();
      setTrendingMovies(result);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchMovies(debounceSearchItem);
  }, [debounceSearchItem]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <>
      <main>
        <div className="pattern" />

        <div className="wrapper">
          <header>
            <img src="/hero-img.png" alt="hero-img" />
            <h1>
              The best place to watch{" "}
              <span className="text-gradient">Movies</span> You’ll Love Without
              the Hassle
            </h1>
            <Search searchItem={searchItem} setSearchItem={setSearchItem} handleSearch={handleSearch} />
          </header>


          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {moviesList.length > 0 ? (
                  <ul>
                    {moviesList.map((movie) => (
                      <Moviecard key={movie.id} movie={movie} />
                    ))}
                  </ul>
                ) : (
                  <p className="error">{errorMessage}</p>
                )}
              </>
            )}
          </section>

        </div>
      </main>
    </>
  );
};

export default App;
