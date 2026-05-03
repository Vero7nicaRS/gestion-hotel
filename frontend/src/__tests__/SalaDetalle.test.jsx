import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SalaDetalle from "../pages/SalaDetalle";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { waitFor } from "@testing-library/react";

//mostrar cargando al inicio
test("muestra loading al inicio", () => {
  global.fetch = vi.fn(() =>
    new Promise(() => {}) // nunca responde → fuerza loading
  );

  render(
    <MemoryRouter initialEntries={["/tipo-sala/1"]}>
      <SalaDetalle />
    </MemoryRouter>
  );

  expect(screen.getByText(/cargando/i)).toBeInTheDocument();
});

//Error
test("muestra error si falla la API", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
    })
  );

  render(
    <MemoryRouter initialEntries={["/tipo-sala/1"]}>
      <SalaDetalle />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});

//lesctura de datos correcta
test("Muestra el render de datos", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          nombre: "Sala Premium",
          precio: 200
        }),
    })
  );
  render(
    <MemoryRouter initialEntries={["/tipo-sala/1"]}>
      <SalaDetalle />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/Sala Premium/i)).toBeInTheDocument();
  });
});
