import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage.tsx"; // Vamos a crear este en el siguiente paso

function App() {
  return (
    <BrowserRouter>
      {/* El Navbar siempre visible arriba */}
      <Navbar />
      
      {/* Aquí cambia el contenido según la URL */}
      <Routes>
        {/* Ruta Raíz: Notas Activas */}
        <Route 
            path="/" 
            element={<HomePage isArchivedView={false} />} 
        />

        {/* Ruta Archivadas: Notas Archivadas (Reusa el componente) */}
        <Route 
            path="/archived" 
            element={<HomePage isArchivedView={true} />} 
        />

        {/* Ruta Categorías: Gestión CRUD de categorías */}
        <Route 
            path="/categories" 
            element={<CategoriesPage />} 
        />

        {/* Catch-all: Cualquier ruta rara te manda al Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;