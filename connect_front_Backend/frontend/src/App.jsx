import React, { useEffect, useState } from "react";

const App = () => {
  const [jokes, setJokes] = useState([]);

  useEffect(() => !jokes.length && fetchJokes(), []);

  async function fetchJokes() {
    try {
      const data = await fetch("/api/jokes");
      if (data.status == 200) {
        const res = await data.json();
        setJokes(res);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h1>Full Stack</h1>
      <p>Jokes {jokes.length}</p>
      {jokes?.map((joke) => {
        return (
          <div key={joke?.id}>
            <h3>{joke.title}</h3>
            <p>{joke.content}</p>
          </div>
        );
      })}
    </div>
  );
};

export default App;
