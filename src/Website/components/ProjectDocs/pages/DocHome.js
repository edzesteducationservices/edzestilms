import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";

function DocHome() {
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch("/data/docs.json");
        const data = await response.json();
        if (data.chapters) {
          setChapters(data.chapters);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, []);

  // Format title into slug
  const formatSlug = (title) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <Container className="mt-4">
      <h1>Welcome to MDN Clone</h1>
      <p>Explore documentation on project management.</p>

      <Row className="g-3">
        {chapters.map((chapter, index) => (
          <Col key={index} lg={4} md={6} sm={12} className="d-flex">
            <Card className="flex-grow-1">
              <Card.Body>
                <Card.Title>{chapter.title}</Card.Title>
                <Card.Text>{chapter.content?.[0]}</Card.Text>
                <a href={`/docs/${formatSlug(chapter.title)}`} className="btn btn-primary">
                  Read {chapter.title}
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default DocHome;
