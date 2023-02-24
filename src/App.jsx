import "./App.css";
import { Header, Content, Footer } from "./components";
import { Container, Row } from "react-bootstrap";

function App() {
  return (
    <Container className="App" fluid>
      <Row>
        <Header />
      </Row>
      <Row>
        <Content />
      </Row>
      <Row>
        <Footer />
      </Row>
    </Container>
  );
}

export default App;
