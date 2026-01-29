export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface CategoryDTO {
    name: string;
    description?: string;
}

export interface Note {
    id: number;
    title: string;
    content: string;
    archived: boolean;
    lastModifiedDate?: string;
    creationDate?: string;
    categories: Category[];
}

export type NoteWithCategoriesDTO = Note;

export interface NoteDTO {
    title: string;
    content: string;
    archived: boolean;
    categoryIds: number[];
}