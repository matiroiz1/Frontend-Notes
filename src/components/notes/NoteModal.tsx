import { useEffect, useState } from "react";
import { Modal, Form, Button, Badge, Spinner } from "react-bootstrap";
import type { Note, NoteDTO, Category } from "../../types";
import NotificationService from "../../utils/notificationsService";

interface Props {
    show: boolean;
    onHide: () => void;
    onSubmit: (noteData: NoteDTO, id?: number) => Promise<void>; // El padre maneja la llamada a la API
    noteToEdit?: Note | null;
    availableCategories: Category[];
}

export default function NoteModal({ show, onHide, onSubmit, noteToEdit, availableCategories }: Props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efecto para cargar datos si estamos editando
    useEffect(() => {
        if (show) {
            if (noteToEdit) {
                setTitle(noteToEdit.title);
                setContent(noteToEdit.content);
                // Extraemos solo los IDs de las categorías que ya tiene la nota
                setSelectedCategoryIds(noteToEdit.categories.map(c => c.id));
            } else {
                // Reset si es nueva nota
                setTitle("");
                setContent("");
                setSelectedCategoryIds([]);
            }
        }
    }, [show, noteToEdit]);

    const toggleCategory = (id: number) => {
        if (selectedCategoryIds.includes(id)) {
            setSelectedCategoryIds(prev => prev.filter(cId => cId !== id));
        } else {
            setSelectedCategoryIds(prev => [...prev, id]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const dto: NoteDTO = {
                title,
                content,
                archived: noteToEdit ? noteToEdit.archived : false,
                categoryIds: selectedCategoryIds // ¡Esto es lo que tu backend espera!
            };

            await onSubmit(dto, noteToEdit?.id);
            onHide();
        } catch (error) {
            console.error("Error saving note", error);
            NotificationService.error('Error saving note');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="h4 fw-semibold">
                        {noteToEdit ? "Edit Note" : "Create New Note"}
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body className="pt-3">
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-medium text-secondary">Title</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Ex: Weekly Meeting" 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            autoFocus
                            className="fs-5"
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-medium text-secondary">Content</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={6} 
                            placeholder="Write your thoughts here..." 
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            required
                            className="fs-5"
                            style={{ resize: 'vertical', minHeight: '150px' }}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className="fw-medium text-secondary">Categories</Form.Label>
                        <div className="d-flex flex-wrap gap-2 p-3 bg-light rounded-3">
                            {availableCategories.length > 0 ? availableCategories.map(cat => {
                                const isSelected = selectedCategoryIds.includes(cat.id);
                                return (
                                    <Badge 
                                        key={cat.id}
                                        bg={isSelected ? "primary" : "white"}
                                        text={isSelected ? "white" : "dark"}
                                        className={`user-select-none border ${isSelected ? 'border-primary' : 'border-secondary'} px-3 py-2 fs-6`}
                                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                        onClick={() => toggleCategory(cat.id)}
                                    >
                                        {cat.name} {isSelected && <i className="bi bi-check-circle-fill ms-1"></i>}
                                    </Badge>
                                )
                            }) : (
                                <div className="text-muted fst-italic w-100 text-center py-2">
                                    <i className="bi bi-info-circle me-2"></i>
                                    No categories available. Create one first!
                                </div>
                            )}
                        </div>
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
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-circle me-2"></i>
                                {noteToEdit ? 'Update Note' : 'Create Note'}
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}