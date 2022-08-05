import React, { useCallback, useState, useEffect } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [Error, setError] = useState(null);

  const fetchmoviesHandler = useCallback(async () => {
    setisLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-c2ad3-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!! ");
      }

      const data = await response.json();
      console.log(data);
      
      const loadedMovies =[];
      for (const key in data){
        loadedMovies.push({
          id: key,
          title :data[key].title,
          openingText :data[key].openingText,
          releaseDate :data[key].releaseDate,
         });
      }
 
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setisLoading(false);
  }, []);

  useEffect(() => {
    fetchmoviesHandler();
  }, []);

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-http-c2ad3-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  }

  let content = <p>found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  if (Error) {
    content = <p>{Error}</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchmoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !Error && <p>Found no movies...</p>}
        {isLoading && <p>Loading.... </p>}
        {!isLoading && Error && <p>{Error}</p>} */}
      </section>
    </React.Fragment>
  );
}

export default App;
