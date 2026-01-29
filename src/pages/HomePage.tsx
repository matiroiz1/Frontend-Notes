import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Spinner, Alert } from "react-bootstrap";
import NoteCard from "../components/notes/NoteCard";
import NoteModal from "../components/notes/NoteModal";
import NoteDetailModal from "../components/notes/NoteDetailModal";
import { noteService } from "../services/noteService";
import { categoryService } from "../services/categoryService";
import NotificationService from "../utils/notificationsService";
import type { Note, Category, NoteDTO } from "../types";

interface Props {
    isArchivedView?: boolean; // Para saber si estamos en /archived o en /
}

export default function HomePage({ isArchivedView = false }: Props) {
    // --- ESTADOS ---
    const [notes, setNotes] = useState<Note[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filtros
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

    // Detail Modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [noteToView, setNoteToView] = useState<Note | null>(null);

    // --- CARGA DE DATOS ---
    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Cargamos categorías (para el filtro y el modal)
            const catsData = await categoryService.getAll();
            setCategories(catsData);

            // 2. Cargamos notas según la vista
            let notesData: Note[] = [];

            if (selectedCategoryId) {
                // Si hay filtro de categoría, usamos el endpoint de filtro
                notesData = await noteService.filterByCategory(selectedCategoryId);
                // Filtramos manualmente si es archivado o no (si el back no filtra eso en este endpoint)
                notesData = notesData.filter(n => n.archived === isArchivedView);
            } else {
                // Si no hay filtro, carga normal
                notesData = isArchivedView 
                    ? await noteService.getArchived() 
                    : await noteService.getActive();
            }

            setNotes(notesData);
        } catch (err) {
            console.error(err);
            setError("Failed to load notes. Please check the backend connection.");
        } finally {
            setIsLoading(false);
        }
    };

    // Recargar cuando cambia la vista o el filtro
    useEffect(() => {
        loadData();
    }, [isArchivedView, selectedCategoryId]);

    // --- MANEJADORES DE ACCIONES ---

    const handleCreateClick = () => {
        setNoteToEdit(null); // NULL = Modo Crear
        setShowModal(true);
    };

    const handleEditClick = (note: Note) => {
        setNoteToEdit(note); // OBJETO = Modo Editar
        setShowModal(true);
    };

    const handleViewClick = (note: Note) => {
        setNoteToView(note);
        setShowDetailModal(true);
    };

    const handleDelete = async (id: number) => {
        const confirmed = await NotificationService.confirmDelete('this note');
        if (!confirmed) return;
        try {
            await noteService.delete(id);
            NotificationService.success('Note deleted successfully');
            loadData(); // Recargamos la lista
        } catch (e) { 
            NotificationService.error('Error deleting note');
        }
    };

    const handleArchiveToggle = async (id: number) => {
        try {
            await noteService.toggleArchive(id);
            NotificationService.success('Note archive status updated');
            loadData(); // La nota desaparecerá o aparecerá según la vista
        } catch (e) { 
            NotificationService.error('Error updating archive status');
        }
    };

    // --- AQUÍ ESTÁ LA LÓGICA DUAL DEL MODAL ---
    const handleModalSubmit = async (noteData: NoteDTO, id?: number) => {
        try {
            if (id) {
                // Si hay ID -> UPDATE
                await noteService.update(id, noteData);
                NotificationService.success('Note updated successfully');
            } else {
                // Si no hay ID -> CREATE
                await noteService.create(noteData);
                NotificationService.success('Note created successfully');
            }
            loadData(); // Refrescamos la lista para ver los cambios
        } catch (err) {
            console.error("Error saving:", err);
            NotificationService.error('Could not save the note');
            throw err; // El modal captura esto para dejar de cargar
        }
    };

    return (
        <Container className="py-4">
            {/* Cabecera y Filtros */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                <h1 className="mb-0 fw-bold text-secondary">
                    {isArchivedView ? "Archived Notes" : "My Notes"}
                </h1>

                <div className="d-flex gap-3 align-items-center" style={{ minWidth: '400px' }}>
                    {/* Select de Filtro */}
                    <Form.Select 
                        value={selectedCategoryId || ""} 
                        onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                        className="fs-6"
                        style={{ height: '48px', width: '200px' }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </Form.Select>

                    {!isArchivedView && (
                        <Button 
                            variant="primary" 
                            onClick={handleCreateClick}
                            className="px-3 py-2 fs-6"
                            style={{ height: '48px', whiteSpace: 'nowrap' }}
                        >
                            <i className="bi bi-plus-lg me-2"></i>New Note
                        </Button>
                    )}
                </div>
            </div>

            {/* Manejo de errores y carga */}
            {error && <Alert variant="danger">{error}</Alert>}
            
            {isLoading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Row>
                    {notes.length > 0 ? (
                        notes.map(note => (
                            <Col key={note.id} xs={12} md={6} lg={4} className="mb-4">
                                <NoteCard 
                                    note={note}
                                    onEdit={handleEditClick}
                                    onView={handleViewClick}
                                    onArchive={handleArchiveToggle}
                                    onDelete={handleDelete}
                                />
                            </Col>
                        ))
                    ) : (
                        <Col xs={12} className="text-center py-5 text-muted">
                            <h4>Nothing here yet!</h4>
                            <p>{isArchivedView ? "No archived notes found." : "Create a note to get started."}</p>
                        </Col>
                    )}
                </Row>
            )}

            {/* El Modal Inteligente */}
            <NoteModal 
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleModalSubmit}
                noteToEdit={noteToEdit}
                availableCategories={categories}
            />

            {/* Modal de Vista Detallada */}
            <NoteDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                note={noteToView}
                onEdit={handleEditClick}
            />
        </Container>
    );
}