import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

function Search() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/docs/${query.toLowerCase()}`);
  };

  return (
    <Form className="d-flex">
      <Form.Control
        type="text"
        placeholder="Search docs..."
        className="me-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button variant="primary" onClick={handleSearch}>Go</Button>
    </Form>
  );
}

export default Search;
