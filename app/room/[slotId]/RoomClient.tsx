"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

interface RoomClientProps {
  token: string;
  serverUrl: string;
}

export default function RoomClient({ token, serverUrl }: RoomClientProps) {
  const router = useRouter();

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={true}
      audio={true}
      onDisconnected={() => {
        router.push("/dashboard");
      }}
      data-lk-theme="default"
      style={{ height: "100vh" }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
