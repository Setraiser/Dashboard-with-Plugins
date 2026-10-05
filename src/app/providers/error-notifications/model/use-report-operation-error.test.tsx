import { fireEvent, render, screen } from "@testing-library/react";
import { ApiClientError } from "@/shared/lib/server/apiClient/api-client-error";
import { ErrorNotificationProvider } from "../ui/error-notification-provider";
import { useReportOperationError } from "./use-report-operation-error";

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
    render(
      <ErrorNotificationProvider>
        <ReportErrorButton error={new ApiClientError(401, "Raw server text")} />
      </ErrorNotificationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Report error" }));

    expect(mockReplace).toHaveBeenCalledWith("/login");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows the caller's safe fallback message for recoverable errors", () => {
    render(
      <ErrorNotificationProvider>
        <ReportErrorButton
          error={new ApiClientError(500, "Database credentials leaked")}
        />
      </ErrorNotificationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Report error" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Не удалось сохранить задачу.",
    );
    expect(screen.getByRole("alert")).not.toHaveTextContent(
      "Database credentials leaked",
    );
  });
});
