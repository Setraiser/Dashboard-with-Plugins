import { fireEvent, render, screen } from "@testing-library/react";

import { LoginForm } from "./login/ui/LoginForm/LoginForm";
import { RegisterForm } from "./register/ui/RegisterForm/RegisterForm";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock("./login/server/loginRequest", () => ({
  loginRequest: jest.fn(),
}));

jest.mock("./register/server/registerRequest", () => ({
  registerRequest: jest.fn(),
}));

describe("authentication form validation", () => {
  it("highlights empty login fields and explains the errors", async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Войти" }));

    expect(await screen.findByText("Введите email")).toBeInTheDocument();
    expect(screen.getByText("Введите пароль")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Email")).toHaveClass("border-red-500");
    expect(screen.getByLabelText("Пароль")).toHaveAttribute("aria-describedby", "password-error");
  });

  it("reports a password mismatch on registration", async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Имя"), { target: { value: "Иван" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ivan@example.com" } });
    fireEvent.change(screen.getByLabelText("Пароль"), { target: { value: "secret1" } });
    fireEvent.change(screen.getByLabelText("Подтвердите пароль"), {
      target: { value: "secret2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Зарегистрироваться" }));

    expect(await screen.findByText("Пароли не совпадают")).toBeInTheDocument();
    expect(screen.getByLabelText("Подтвердите пароль")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("Подтвердите пароль")).toHaveClass("border-red-500");
  });
});
