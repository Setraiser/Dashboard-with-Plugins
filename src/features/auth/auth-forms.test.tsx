import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { LoginForm } from "./login/ui/LoginForm/LoginForm";
import { loginRequest } from "./login/server/loginRequest";
import { ApiClientError } from "@/shared/lib/server/apiClient/api-client-error";
import { RegisterForm } from "./register/ui/RegisterForm/RegisterForm";
import { registerRequest } from "./register/server/registerRequest";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock("./login/server/loginRequest", () => ({
  loginRequest: jest.fn(),
}));

jest.mock("./register/server/registerRequest", () => ({
  registerRequest: jest.fn(),
}));

const mockLoginRequest = jest.mocked(loginRequest);
const mockRegisterRequest = jest.mocked(registerRequest);

describe("authentication form validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it("shows a readable server error when login fails", async () => {
    mockLoginRequest.mockRejectedValue(
      new ApiClientError(401, "Raw server error"),
    );

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "secret1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Войти" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Неверный email или пароль.",
    );
    expect(screen.getByRole("alert")).not.toHaveTextContent("Raw server error");
  });

  it("does not expose raw server errors for unexpected login failures", async () => {
    mockLoginRequest.mockRejectedValue(
      new ApiClientError(500, "Database credentials leaked"),
    );

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "secret1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Войти" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Не удалось выполнить вход. Попробуйте ещё раз.",
    );
    expect(screen.getByRole("alert")).not.toHaveTextContent(
      "Database credentials leaked",
    );
  });

  it("shows a readable server error when registration fails", async () => {
    mockRegisterRequest.mockRejectedValue(
      new ApiClientError(409, "Raw server conflict message"),
    );

    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText("Имя"), {
      target: { value: "Иван" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ivan@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "secret1" },
    });
    fireEvent.change(screen.getByLabelText("Подтвердите пароль"), {
      target: { value: "secret1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Зарегистрироваться" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Аккаунт с таким email уже существует.",
      );
      expect(screen.getByRole("alert")).not.toHaveTextContent(
        "Raw server conflict message",
      );
    });
  });
});
