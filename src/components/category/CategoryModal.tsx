import { useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { categoryService } from "../../services/categoryService";
import NotificationService from "../../utils/notificationsService";

interface Props {
    show: boolean;
    onHide: () => void;
    onCreated: () => void; // Para avisarle al padre que recargue la lista
}

export default function CategoryModal({ show, onHide, onCreated }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await categoryService.create({ name, description });
            // Limpieza
            setName("");
            setDescription("");
            onCreated(); // Avisamos al padre
            onHide();    // Cerramos
        } catch (error) {
            console.error(error);
            NotificationService.showError('Error creating category', 'Make sure the name is unique.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="h4 fw-semibold">
                        New Category
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-medium text-secondary">Name</Form.Label>
                        <Form.Control 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Ex: Work, Personal, Ideas"
                            required 
                            autoFocus
                            className="fs-5"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="fw-medium text-secondary">Description (Optional)</Form.Label>
                        <Form.Control 
                            as="textarea"
                            rows={4}
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            placeholder="What is this category for?"
                            className="fs-5"
                            style={{ resize: 'vertical', minHeight: '100px' }}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button 
                        variant="outline-secondary" 
                        onClick={onHide} 
                        disabled={isSubmitting}
                        className="px-4"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-4"
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-plus-circle me-2"></i>
                                Create Category
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}