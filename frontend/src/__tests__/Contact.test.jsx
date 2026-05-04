import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "../pages/Contact";

//Inputs
test("permite escribir en el formulario de contacto", async () => {
  const user = userEvent.setup();

  render(<Contact />);

  const nombre = screen.getByPlaceholderText(/tu nombre/i);
  const email = screen.getByPlaceholderText(/tucorreo/i);
  const mensaje = screen.getByPlaceholderText(/cuéntanos/i);

  await user.type(nombre, "Juan");
  await user.type(email, "juan@test.com");
  await user.type(mensaje, "Hola mundo");

  expect(nombre).toHaveValue("Juan");
  expect(email).toHaveValue("juan@test.com");
  expect(mensaje).toHaveValue("Hola mundo");
});

//Error
test("muestra error si envías formulario vacío", async () => {
  const user = userEvent.setup();

  render(<Contact />);

  await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

  expect(
    screen.getByText(/por favor completa todos los campos/i)
  ).toBeInTheDocument();
});