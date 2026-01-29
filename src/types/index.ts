export interface User {
    username: string;
    token?: string;
}

export interface AuthResponse {
    token: string;
    username: string;
}

export interface LoginRequest {
    username: string;
    password:   string;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

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