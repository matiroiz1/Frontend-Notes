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
    isArchivedView?: boolean; // To know if we are in /archived or in /
}

export default function HomePage({ isArchivedView = false }: Props) {
    // --- STATES ---
    const [notes, setNotes] = useState<Note[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

    // Detail Modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [noteToView, setNoteToView] = useState<Note | null>(null);

    // --- DATA LOADING ---
    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Load categories (for filter and modal)
            const catsData = await categoryService.getAll();
            setCategories(catsData);

            // 2. Load notes according to view
            let notesData: Note[] = [];

            if (selectedCategoryId) {
                // If there is category filter, use the filter endpoint
                notesData = await noteService.filterByCategory(selectedCategoryId);
                // Manually filter if archived or not (if backend doesn't filter this in this endpoint)
                notesData = notesData.filter(n => n.archived === isArchivedView);
            } else {
                // If no filter, normal load
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

    // Reload when view or filter changes
    useEffect(() => {
        loadData();
    }, [isArchivedView, selectedCategoryId]);

    // --- ACTION HANDLERS ---

    const handleCreateClick = () => {
        setNoteToEdit(null); // NULL = Create Mode
        setShowModal(true);
    };

    const handleEditClick = (note: Note) => {
        setNoteToEdit(note); // OBJECT = Edit Mode
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
            loadData(); // Reload list
        } catch (e) { 
            NotificationService.error('Error deleting note');
        }
    };

    const handleArchiveToggle = async (id: number) => {
        try {
            await noteService.toggleArchive(id);
            NotificationService.success('Note archive status updated');
            loadData(); // Note will disappear or appear according to view
        } catch (e) { 
            NotificationService.error('Error updating archive status');
        }
    };

    // --- HERE IS THE DUAL MODAL LOGIC ---
    const handleModalSubmit = async (noteData: NoteDTO, id?: number) => {
        try {
            if (id) {
                // If there is ID -> UPDATE
                await noteService.update(id, noteData);
                NotificationService.success('Note updated successfully');
            } else {
                // If there is no ID -> CREATE
                await noteService.create(noteData);
                NotificationService.success('Note created successfully');
            }
            loadData(); // Refresh list to see changes
        } catch (err) {
            console.error("Error saving:", err);
            NotificationService.error('Could not save the note');
            throw err; // Modal captures this to stop loading
        }
    };

    return (
        <Container className="py-4">
            {/* Header and Filters */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                <h1 className="mb-0 fw-bold text-secondary">
                    {isArchivedView ? "Archived Notes" : "My Notes"}
                </h1>

                <div className="d-flex gap-3 align-items-center" style={{ minWidth: '400px' }}>
                    {/* Filter Select */}
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

            {/* Error handling and loading */}
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

            {/* The Smart Modal */}
            <NoteModal 
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleModalSubmit}
                noteToEdit={noteToEdit}
                availableCategories={categories}
            />

            {/* Detail View Modal */}
            <NoteDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                note={noteToView}
                onEdit={handleEditClick}
            />
        </Container>
    );
}