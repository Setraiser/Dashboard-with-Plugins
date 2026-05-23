import type { Meta, StoryObj } from "@storybook/react";
import { ClockWidget } from "../widgets/clock-widget/ui/clock-widget/clock-widget";

const meta: Meta<typeof ClockWidget> = {
  title: "Plugins/ClockWidget",
  component: ClockWidget,
};

export default meta;

type Story = StoryObj<typeof ClockWidget>;

export const Default: Story = {
  args: {
    instanceId: "clock-1",
    config: { title: "Local time" },
    host: {
      logger: {
        info: () => undefined,
        warn: () => undefined,
        error: () => undefined,
      },
      navigate: () => undefined,
      getUser: () => ({ id: "demo", role: "admin" }),
      hasPermission: () => true,
      request: async () => ({}) as never,
      emitEvent: () => undefined,
    },
  },
};
