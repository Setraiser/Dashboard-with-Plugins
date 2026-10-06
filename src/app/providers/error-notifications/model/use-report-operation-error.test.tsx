import { fireEvent, screen } from "@testing-library/react";
import { ApiClientError } from "@/shared/lib/server/apiClient/api-client-error";
import { ErrorNotificationProvider } from "../ui/error-notification-provider";
import { useReportOperationError } from "./use-report-operation-error";
import { renderWithIntl } from "@/test/renderWithIntl";

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

function ReportErrorButton({ error }: { error: unknown }) {
  const reportOperationError = useReportOperationError();

  return (
    <button
      onClick={() =>
        reportOperationError(error, "Не удалось сохранить задачу.")
      }
    >
      Report error
    </button>
  );
}

describe("useReportOperationError", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to login when an operation fails because the session expired", () => {
    renderWithIntl(
      <ErrorNotificationProvider>
        <ReportErrorButton error={new ApiClientError(401, "SESSION_EXPIRED")} />
      </ErrorNotificationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Report error" }));

    expect(mockReplace).toHaveBeenCalledWith("/login");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("translates internal API error codes using the current host locale", () => {
    renderWithIntl(
      <ErrorNotificationProvider>
        <ReportErrorButton
          error={new ApiClientError(500, "INTERNAL_ERROR")}
        />
      </ErrorNotificationProvider>,
      { locale: "ru" },
    );

    fireEvent.click(screen.getByRole("button", { name: "Report error" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Что-то пошло не так. Попробуйте ещё раз.",
    );
  });

  it("uses a plugin-provided safe fallback for unknown codes", () => {
    renderWithIntl(
      <ErrorNotificationProvider>
        <ReportErrorButton error={new ApiClientError(409, "PLUGIN_CONFLICT")} />
      </ErrorNotificationProvider>,
      { locale: "ru" },
    );

    fireEvent.click(screen.getByRole("button", { name: "Report error" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Не удалось сохранить задачу.",
    );
  });
});
