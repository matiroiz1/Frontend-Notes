import { Navbar as BsNavbar, Container, Nav, Dropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, username, logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // If not logged in, don't show navbar
    if (!isAuthenticated) return null;

    return (
        <BsNavbar expand="lg" className="bg-white border-bottom shadow-sm mb-4 sticky-top" style={{ padding: '12px 0' }}>
            <Container>
                {/* Logo */}
                <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                    <i className="bi bi-journal-text text-primary fs-3"></i>
                    <span className="fw-bold text-secondary fs-4">NotesApp</span>
                </BsNavbar.Brand>

                <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
                
                <BsNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto ms-3">
                        <Nav.Link 
                            as={Link} to="/" 
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
                            as={Link} to="/archived" 
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
                            as={Link} to="/categories" 
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

                    {/* Right side: User Info only */}
                    <div className="d-flex align-items-center gap-3">
                        {/* User Dropdown */}
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="light" id="dropdown-user" className="d-flex align-items-center gap-2 border-0 bg-transparent">
                                <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center" style={{ width: 32, height: 32 }}>
                                    {username?.charAt(0).toUpperCase()}
                                </div>
                                <span className="d-none d-md-inline fw-semibold text-secondary">{username}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleLogout} className="text-danger">
                                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
}