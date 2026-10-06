import { fireEvent, screen, waitFor } from "@testing-library/react";

import { LoginForm } from "./login/ui/LoginForm/LoginForm";
import { loginRequest } from "./login/server/loginRequest";
import { ApiClientError } from "@/shared/lib/server/apiClient/api-client-error";
import { RegisterForm } from "./register/ui/RegisterForm/RegisterForm";
import { registerRequest } from "./register/server/registerRequest";
import { renderWithIntl } from "@/test/renderWithIntl";

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
    renderWithIntl(<LoginForm />, { locale: "ru" });

    fireEvent.click(screen.getByRole("button", { name: "Войти" }));

    expect(
      await screen.findByText("Введите адрес электронной почты."),
    ).toBeInTheDocument();
    expect(screen.getByText("Введите пароль.")).toBeInTheDocument();
    expect(screen.getByLabelText("Электронная почта")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("Электронная почта")).toHaveClass(
      "border-red-500",
    );
    expect(screen.getByLabelText("Пароль")).toHaveAttribute("aria-describedby", "password-error");
  });

  it("renders translated host authentication UI in English", async () => {
    renderWithIntl(<LoginForm />, { locale: "en" });

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Enter your email.")).toBeInTheDocument();
    expect(screen.getByText("Enter your password.")).toBeInTheDocument();
  });

  it("reports a password mismatch on registration", async () => {
    renderWithIntl(<RegisterForm />, { locale: "ru" });

    fireEvent.change(screen.getByLabelText("Имя"), { target: { value: "Иван" } });
    fireEvent.change(screen.getByLabelText("Электронная почта"), {
      target: { value: "ivan@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), { target: { value: "secret1" } });
    fireEvent.change(screen.getByLabelText("Подтвердите пароль"), {
      target: { value: "secret2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Создать аккаунт" }));

    expect(
      await screen.findByText("Пароли не совпадают."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Подтвердите пароль")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("Подтвердите пароль")).toHaveClass("border-red-500");
  });

  it("shows a readable server error when login fails", async () => {
    mockLoginRequest.mockRejectedValue(
      new ApiClientError(401, "INVALID_CREDENTIALS"),
    );

    renderWithIntl(<LoginForm />, { locale: "ru" });
    fireEvent.change(screen.getByLabelText("Электронная почта"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "secret1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Войти" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Неверный адрес электронной почты или пароль.",
    );
    expect(screen.getByRole("alert")).not.toHaveTextContent("Raw server error");
  });

  it("does not expose raw server errors for unexpected login failures", async () => {
    mockLoginRequest.mockRejectedValue(
      new ApiClientError(500, "INTERNAL_ERROR"),
    );

    renderWithIntl(<LoginForm />, { locale: "ru" });
    fireEvent.change(screen.getByLabelText("Электронная почта"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "secret1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Войти" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Не удалось войти. Попробуйте ещё раз.",
    );
    expect(screen.getByRole("alert")).not.toHaveTextContent(
      "Database credentials leaked",
    );
  });

  it("shows a readable server error when registration fails", async () => {
    mockRegisterRequest.mockRejectedValue(
      new ApiClientError(409, "EMAIL_ALREADY_EXISTS"),
    );

    renderWithIntl(<RegisterForm />, { locale: "ru" });
    fireEvent.change(screen.getByLabelText("Имя"), {
      target: { value: "Иван" },
    });
    fireEvent.change(screen.getByLabelText("Электронная почта"), {
      target: { value: "ivan@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "secret1" },
    });
    fireEvent.change(screen.getByLabelText("Подтвердите пароль"), {
      target: { value: "secret1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Создать аккаунт" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Аккаунт с такой электронной почтой уже существует.",
      );
      expect(screen.getByRole("alert")).not.toHaveTextContent(
        "Raw server conflict message",
      );
    });
  });
});
