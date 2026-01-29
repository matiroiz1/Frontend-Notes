import { Modal, Badge, Button } from "react-bootstrap";
import type { Note } from "../../types";

interface Props {
    show: boolean;
    onHide: () => void;
    note: Note | null;
    onEdit: (note: Note) => void;
}

export default function NoteDetailModal({ show, onHide, note, onEdit }: Props) {
    if (!note) return null;

    const dateStr = new Date(note.lastModifiedDate || Date.now()).toLocaleDateString();

    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            centered 
            size="lg"
            className="note-detail-modal"
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center w-100">
                    <Modal.Title className="h3 fw-semibold mb-0">
                        {note.title}
                    </Modal.Title>
                    {note.archived && <Badge bg="warning" text="dark" className="px-3 py-2">Archived</Badge>}
                </div>
            </Modal.Header>
            
            <Modal.Body className="pt-3">
                {/* Categorías */}
                <div className="mb-4">
                    <div className="d-flex flex-wrap gap-2">
                        {note.categories.length > 0 ? (
                            note.categories.map(cat => (
                                <Badge key={cat.id} bg="light" text="dark" className="border px-3 py-2 fs-6">
                                    {cat.name}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted fst-italic">No categories</span>
                        )}
                    </div>
                </div>

                {/* Contenido */}
                <div className="mb-4">
                    <h5 className="text-muted mb-3">Content</h5>
                    <div 
                        className="fs-5 text-secondary" 
                        style={{ 
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6,
                            minHeight: '200px'
                        }}
                    >
                        {note.content || <span className="text-muted fst-italic">No content</span>}
                    </div>
                </div>

                {/* Metadata */}
                <div className="d-flex justify-content-start align-items-center pt-3 border-top">
                    <small className="text-muted fs-6">
                        Last modified: {dateStr}
                    </small>
                </div>
            </Modal.Body>

            <Modal.Footer className="border-0 pt-0">
                <Button 
                    variant="outline-secondary" 
                    onClick={onHide}
                    className="px-4"
                >
                    Close
                </Button>
                <Button 
                    variant="primary" 
                    onClick={() => {
                        onEdit(note);
                        onHide();
                    }}
                    className="px-4"
                >
                    <i className="bi bi-pencil-fill me-2"></i>
                    Edit Note
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
