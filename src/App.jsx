import "./App.css";
import { Header, Content, Footer, Page } from "./components";
import { Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

function App() {
  const [query, setQuery] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const updateQuery = (newQuery) => {
    setQuery(newQuery);
  };

  
  return (
    <Container className="App" fluid>
      <Row>
        <Header query={query} updateQuery={updateQuery} />
      </Row>
      <Row className="main">
        <Routes>
          <Route
            path="/"
            element={
              <Content
                query={query}
              />
            }
          />
          <Route path="/page/:pageName" element={<Page/>} />
        </Routes>
      </Row>
      <Row>
        <Footer />
      </Row>
    </Container>
  );
}

export default App;
