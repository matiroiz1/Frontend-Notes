import { Navbar as BsNavbar, Container, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();

    // Helper para saber si un link está activo
    const isActive = (path: string) => location.pathname === path;

    return (
        <BsNavbar expand="lg" className="bg-white border-bottom shadow-sm mb-4 sticky-top" style={{ padding: '12px 0' }}>
            <Container>
                {/* Logo / Brand */}
                <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                    <i className="bi bi-journal-text text-primary fs-3"></i>
                    <span className="fw-bold text-secondary fs-4">NotesApp</span>
                </BsNavbar.Brand>

                <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
                
                <BsNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto ms-3">
                        <Nav.Link 
                            as={Link} 
                            to="/" 
                            active={isActive("/")}
                            className="fw-semibold fs-6 px-3 py-2 rounded-3 transition-all"
                            style={{
                                backgroundColor: isActive("/") ? 'var(--primary-color)' : 'transparent',
                                color: isActive("/") ? 'white' : 'var(--text-secondary)',
                                margin: '0 4px'
                            }}
                        >
                            <i className="bi bi-card-text me-2"></i> Active Notes
                        </Nav.Link>
                        
                        <Nav.Link 
                            as={Link} 
                            to="/archived" 
                            active={isActive("/archived")}
                            className="fw-semibold fs-6 px-3 py-2 rounded-3 transition-all"
                            style={{
                                backgroundColor: isActive("/archived") ? 'var(--primary-color)' : 'transparent',
                                color: isActive("/archived") ? 'white' : 'var(--text-secondary)',
                                margin: '0 4px'
                            }}
                        >
                            <i className="bi bi-archive me-2"></i> Archived
                        </Nav.Link>

                        <Nav.Link 
                            as={Link} 
                            to="/categories" 
                            active={isActive("/categories")}
                            className="fw-semibold fs-6 px-3 py-2 rounded-3 transition-all"
                            style={{
                                backgroundColor: isActive("/categories") ? 'var(--primary-color)' : 'transparent',
                                color: isActive("/categories") ? 'white' : 'var(--text-secondary)',
                                margin: '0 4px'
                            }}
                        >
                            <i className="bi bi-tags me-2"></i> Categories
                        </Nav.Link>
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
}