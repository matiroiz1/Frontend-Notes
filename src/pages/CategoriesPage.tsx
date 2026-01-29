import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types";
import CategoryModal from "../components/category/CategoryModal";
import NotificationService from "../utils/notificationsService";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        setError(null); // Limpiamos errores previos
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (err) {
            console.error(err);
            setError("Could not load categories.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: number, name: string) => {
        const confirmed = await NotificationService.confirmDelete(`category "${name}"`);
        if (!confirmed) return;

        try {
            await categoryService.delete(id);
            NotificationService.success('Category deleted successfully');
            loadData(); // Recargar lista si salió bien
        } catch (err: any) {
            console.error("Delete failed", err);
            // Manejo de error específico (si el backend devuelve 400 o 500 por restricción de FK)
            // Asumimos que cualquier error aquí es porque está en uso, ya que es la única restricción lógica.
            NotificationService.showError(
                'Cannot delete category',
                'This category contains active notes. Please remove the notes from this category first.'
            );
        }
    };

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-secondary mb-0">Manage Categories</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <i className="bi bi-plus-lg me-2"></i>New Category
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {isLoading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Row>
                    {categories.length > 0 ? (
                        categories.map(cat => (
                            <Col key={cat.id} xs={12} md={6} lg={4} className="mb-4">
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Body className="d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <i className="bi bi-tag-fill text-primary fs-5"></i>
                                            <Card.Title className="h5 mb-0">{cat.name}</Card.Title>
                                        </div>
                                        
                                        <Card.Text className="text-muted flex-grow-1">
                                            {cat.description || <em className="small">No description provided</em>}
                                        </Card.Text>
                                        
                                        <div className="mt-3 pt-3 border-top text-end">
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDelete(cat.id, cat.name)}
                                                title="Delete Category"
                                            >
                                                <i className="bi bi-trash"></i> Delete
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col xs={12} className="text-center py-5 text-muted">
                            <h4>No categories yet</h4>
                            <p>Create categories to organize your notes efficiently.</p>
                        </Col>
                    )}
                </Row>
            )}

            <CategoryModal 
                show={showModal} 
                onHide={() => setShowModal(false)}
                onCreated={loadData}
            />
        </Container>
    );
}