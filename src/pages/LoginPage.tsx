import { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth(); // Usamos nuestro contexto

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await authService.login({ username, password });
            login(data.username, data.token); // Actualizamos el estado global
            navigate("/"); // Redirigimos al Home
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            {/* Logo and Brand */}
            <div className="text-center mb-4">
                <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                    <i className="bi bi-journal-text text-primary" style={{ fontSize: '3rem' }}></i>
                    <span className="fw-bold text-secondary" style={{ fontSize: '2.5rem' }}>NotesApp</span>
                </div>
                <h2 className="text-primary fw-bold">Welcome Back</h2>
            </div>
            
            <Card style={{ width: "400px" }} className="shadow border-0">
                <Card.Body className="p-4">
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                required 
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 mb-3">
                            Login
                        </Button>
                    </Form>
                    <div className="text-center">
                        <small className="text-muted">Don't have an account? </small>
                        <Link to="/register" className="fw-bold text-decoration-none">Register</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}