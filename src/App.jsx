import "./App.css";
import { Header, Content, Footer } from "./components";
import { Container, Row } from "react-bootstrap";
import data from "./data/data.json";
import { useCallback, useState } from "react";

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
      <Row>
        <Content
          linksData={data.links}
          nodesData={data.nodes}
          query={query}
        />
      </Row>
      <Row>
        <Footer />
      </Row>
    </Container>
  );
}

export default App;
