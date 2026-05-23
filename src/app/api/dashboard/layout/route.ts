import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    id: "default",
    widgets: [
      {
        instanceId: "clock-main-1",
        pluginId: "clock",
        slot: "dashboard.main",
        config: { title: "Local time" },
      },
    ],
  });
}
