import { Card, Badge, Button, Stack } from "react-bootstrap";
import type { Note } from "../../types";

interface Props {
    note: Note;
    onArchive: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (note: Note) => void;
    onView: (note: Note) => void;
}

export default function NoteCard({ note, onArchive, onDelete, onEdit, onView }: Props) {
    // Clean date formatting
    const dateStr = new Date(note.lastModifiedDate || Date.now()).toLocaleDateString();

    return (
        <Card 
            className="h-100 note-card" 
            onClick={() => onView(note)}
            style={{ 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
            }}
        >
            <Card.Body className="d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <Card.Title className="h4 mb-0 fw-semibold" style={{ maxWidth: '85%', lineHeight: 1.3 }}>
                        {note.title}
                    </Card.Title>
                    {note.archived && <Badge bg="warning" text="dark" className="px-2 py-1">Archived</Badge>}
                </div>

                {/* Lista de Categorías */}
                <Stack direction="horizontal" gap={1} className="mb-3 flex-wrap">
                    {note.categories.length > 0 ? (
                        note.categories.map(cat => (
                            <Badge key={cat.id} bg="light" text="dark" className="border px-2 py-1">
                                {cat.name}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-muted small fst-italic">No categories</span>
                    )}
                </Stack>

                <Card.Text className="flex-grow-1 text-secondary fs-6" style={{ 
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.5
                }}>
                    {note.content.length > 100 
                        ? `${note.content.substring(0, 100)}...` 
                        : note.content}
                </Card.Text>

                <div className="mt-auto pt-3 d-flex justify-content-between align-items-center">
                    <small className="text-muted fs-6">{dateStr}</small>
                    
                    <div className="d-flex gap-2">
                        <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(note);
                            }}
                            className="d-flex align-items-center justify-content-center"
                            style={{ 
                                width: '36px', 
                                height: '36px'
                            }}
                        >
                            <i className="bi bi-pencil-fill"></i>
                        </Button>
                        <Button 
                            variant={note.archived ? "outline-success" : "outline-warning"} 
                            size="sm" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onArchive(note.id);
                            }}
                            title={note.archived ? "Unarchive" : "Archive"}
                            className="d-flex align-items-center justify-content-center"
                            style={{ 
                                width: '36px', 
                                height: '36px'
                            }}
                        >
                            <i className={`bi ${note.archived ? 'bi-box-arrow-up' : 'bi-archive-fill'}`}></i>
                        </Button>
                        <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(note.id);
                            }}
                            className="d-flex align-items-center justify-content-center"
                            style={{ 
                                width: '36px', 
                                height: '36px'
                            }}
                        >
                            <i className="bi bi-trash-fill"></i>
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}