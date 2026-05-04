import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest"; //framework de testing, crear funciones falsas
import HabitacionDetalle from "../pages/HabitacionDetalle";

beforeEach(() => {
  global.fetch = vi.fn()
    // FETCH 1: detalle habitación
    .mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          nombre: "Premium",
          precio: 120,
          descripcion: "Habitación bonita",
          tipo_habitacion: {
            nombre: "premium",
            precio: 120,
            descripcion: "Habitación bonita",
          },
        }),
    })

    // FETCH 2: FormularioHabitacion (evita crash)
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });
});

afterEach(() => {
  vi.clearAllMocks();
});

test("muestra datos de la habitación correctamente", async () => {
  render(
    <MemoryRouter initialEntries={["/habitacion/1"]}>
      <Routes>
        <Route path="/habitacion/:id" element={<HabitacionDetalle />} />
      </Routes>
    </MemoryRouter>
  );

  // loading
  expect(screen.getByText(/cargando/i)).toBeInTheDocument();

  // contenido final
  await waitFor(() => {
    expect(screen.getByText(/Habitación Premium/i)).toBeInTheDocument();
  });

  expect(screen.getByText(/Habitación bonita/i)).toBeInTheDocument();
  expect(screen.getByText(/120/i)).toBeInTheDocument();
});

//Error si falla API
test("muestra error si falla la API", async () => {
  global.fetch = vi.fn()
    .mockResolvedValueOnce({
      ok: false,
      status: 500,
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

  render(
    <MemoryRouter initialEntries={["/habitacion/1"]}>
      <Routes>
        <Route path="/habitacion/:id" element={<HabitacionDetalle />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/ERROR HTTP/i)).toBeInTheDocument();
  });
});