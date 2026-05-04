import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "../pages/Contact";
import AdminDashboard from "../pages/admin/AdminDashboard";
import { MemoryRouter } from "react-router-dom";


test("permite acceder en el panel de disponibilidad a las habitaciones", async() => {
    
    render(
        <MemoryRouter>  {/* Para BrowserRouter */}
            <AdminDashboard/>
        </MemoryRouter>        
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /habitaciones/i }));

    expect(screen.getByText(/gestión de habitaciones/i)).toBeInTheDocument();
    expect(screen.getByText(/crear nueva habitación/i)).toBeInTheDocument();
    
    const desplegables = screen.getAllByRole("combobox");

    expect(desplegables.length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/selecciona un tipo/i).length).toBeGreaterThanOrEqual(2);

    expect(screen.getByText(/editar tipos y reasignar habitaciones/i)).toBeInTheDocument();
});

test("permite acceder en el panel de disponibilidad a las salas", async () => {
    render(
        <MemoryRouter>  {/* Para BrowserRouter */}
            <AdminDashboard/>
        </MemoryRouter>        
    );
  const user = userEvent.setup();

  await user.click(screen.getByRole("button", { name: /salas/i }));

  expect(screen.getByText(/gestión de salas/i)).toBeInTheDocument();

  const desplegables = screen.getAllByRole("combobox");

  expect(desplegables.length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText(/selecciona un tipo/i).length).toBeGreaterThanOrEqual(2);
  expect(screen.getByText(/editar tipos y reasignar salas/i)).toBeInTheDocument();

});