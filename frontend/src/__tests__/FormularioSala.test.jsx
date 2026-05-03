import "@testing-library/jest-dom";
import { render, screen, waitFor,fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event"; //función del formulario como usuario
import FormularioSala from "../components/FormularioSala";

//formulario Sala
test("renderiza el formulario de sala", () => {
  render(<FormularioSala tipoSala="pro" salaId={1} />);

  expect(screen.getByText(/reservar sala/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
});

//Validación de horas
test("muestra error si hora fin <= hora inicio", async () => {
  const user = userEvent.setup();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: 2,
            numero: 8,
            estado: "DISPONIBLE",
            tipo_sala: { nombre: "Pro" },
          },
        ]),
    })
  );
  render(<FormularioSala tipoSala="pro" salaId={1} />);
  //nombre
  await user.type(screen.getByLabelText(/nombre completo/i), "Juan");
  //correo
  await user.type(screen.getByLabelText(/correo/i), "juan@test.com");
  //telefono
  await user.type(screen.getByLabelText(/teléfono/i), "1234567890");
  //fecha de uso
  await user.type(screen.getByLabelText(/fecha de uso/i), "2025-12-01");
  //jornada
  fireEvent.change(screen.getByLabelText(/jornada/i), {
    target: { value: "manana" },
  });
  //hora de inicio
  fireEvent.change(screen.getByLabelText(/hora inicio/i), {
    target: { value: "10" },
  });
  //hora de fin
  fireEvent.change(screen.getByLabelText(/hora fin/i), {
    target: { value: "9" },
});
  //botón de reservar sala
  fireEvent.click(screen.getByRole("button", { name: /reservar sala/i }));
});
