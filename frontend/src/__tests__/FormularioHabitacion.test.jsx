import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import FormularioHabitacion from "../components/FormularioHabitacion";

beforeEach(() => {
  global.fetch = vi.fn()
    .mockImplementation((url, options) => {
      // GET habitaciones
      if (!options) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                numero: 101,
                estado: "DISPONIBLE",
                tipo_habitacion: {
                  nombre: "premium",
                  precio: 120,
                },
              },
            ]),
        });
      }
    });
});

test("renderiza el formulario correctamente", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <FormularioHabitacion tipoHabitacion="premium" habitacionId={1} />
    </MemoryRouter>
  );

  await user.click(
    screen.getByRole("button", { name: /reservar/i })
  );
});
