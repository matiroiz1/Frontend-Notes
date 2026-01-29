import { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validaciones básicas
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 3) {
            setError("Password must be at least 3 characters");
            return;
        }

        setLoading(true);
        try {
            // 1. Registramos en el backend
            const data = await authService.register({ username, password });
            
            // 2. Si sale bien, actualizamos el contexto global (Auto-Login)
            login(data.username, data.token);
            
            // 3. Redirigimos al Home
            navigate("/");
        } catch (err: any) {
            // Manejo de error si el usuario ya existe
            if (err.response && err.response.status === 400) { // O el código que devuelva tu back
                 setError("Username already exists or invalid data.");
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
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
                <h2 className="text-primary fw-bold">Create Account</h2>
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

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={confirmPassword} 
                                onChange={e => setConfirmPassword(e.target.value)} 
                                required 
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                            {loading ? "Creating..." : "Register"}
                        </Button>
                    </Form>

                    <div className="text-center">
                        <small className="text-muted">Already have an account? </small>
                        <Link to="/login" className="fw-bold text-decoration-none">Login</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}