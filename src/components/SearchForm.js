import React, { useEffect, useState } from "react";
import Content from "./Content";
import { Input, Row } from "antd";

const { Search } = Input;

const SearchForm = () => {
  const [movies, setMovies] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const onSearch = (value) => {
    setSearch(value);
    setInput("");
  };

  useEffect(() => {
    const getData = async () => {
      if (search !== "") {
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&s=${search}`
        );
        const data = await response.json();
        setMovies(data.Search);
      }
    };

    getData();
  }, [search]);

  return (
    <>
      <Row justify="center">
        <Search
          value={input}
          defaultValue={input}
          placeholder="Titulo de la película"
          onSearch={onSearch}
          enterButton
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
      </Row>
      <Row justify="center">{movies ? <Content movies={movies} /> : null}</Row>
    </>
  );
};

export default SearchForm;
