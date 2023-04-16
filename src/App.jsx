import "./App.css";
import { Header, Content, Footer, Page } from "./components";
import { Container, Row } from "react-bootstrap";
import data from "./data/data.json";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";

function App() {
  const [query, setQuery] = useState("");
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
                linksData={data.links}
                nodesData={data.nodes}
                query={query}
              />
            }
          />
          <Route path="/page" element={<Page></Page>} />
        </Routes>
      </Row>
      <Row>
        <Footer />
      </Row>
    </Container>
  );
}

export default App;
