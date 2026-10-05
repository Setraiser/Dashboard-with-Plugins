import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  ErrorNotificationProvider,
  useErrorNotification,
} from "./error-notification-provider";

function TriggerNotification() {
  const notifyError = useErrorNotification();

  return (
    <button onClick={() => notifyError("Не удалось сохранить изменения.")}>
      Trigger error
    </button>
  );
}

describe("ErrorNotificationProvider", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows an accessible notification and lets the user dismiss it", () => {
    render(
      <ErrorNotificationProvider>
        <TriggerNotification />
      </ErrorNotificationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Trigger error" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Не удалось сохранить изменения.",
    );

    fireEvent.click(screen.getByRole("button", { name: "Закрыть уведомление" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("automatically dismisses notifications after four seconds", () => {
    jest.useFakeTimers();

    render(
      <ErrorNotificationProvider>
        <TriggerNotification />
      </ErrorNotificationProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Trigger error" }));

    expect(screen.getByRole("alert")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
