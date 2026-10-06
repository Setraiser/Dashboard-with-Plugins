import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithIntl } from "@/test/renderWithIntl";
import { LanguageSwitcher } from "./LanguageSwitcher";

const mockRefresh = jest.fn();
const mockSetLocale = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

jest.mock("@/app/actions/set-locale", () => ({
  setLocale: (...args: unknown[]) => mockSetLocale(...args),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetLocale.mockResolvedValue(undefined);
  });

  it("shows the current locale and lets the user switch to another supported language", async () => {
    renderWithIntl(<LanguageSwitcher />, { locale: "ru" });

    expect(
      screen.getByRole("button", { name: "Переключить язык на русский" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Переключить язык на английский" }),
    ).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(
      screen.getByRole("button", { name: "Переключить язык на английский" }),
    );

    await waitFor(() => {
      expect(mockSetLocale).toHaveBeenCalledWith("en");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("does not request a locale update when the current locale is selected", () => {
    renderWithIntl(<LanguageSwitcher />, { locale: "en" });

    fireEvent.click(
      screen.getByRole("button", { name: "Switch language to English" }),
    );

    expect(mockSetLocale).not.toHaveBeenCalled();
  });
});
