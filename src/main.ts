import { Socket } from "bun";
import { SERVER_INFO } from "./constants";
import { McRequest } from "./mc-request";
import { McResponse } from "./mc-response";
import { PacketId } from "./packet-id";
import { intToVarInt } from "./utils";

let connectionState = 0;

Bun.listen({
  hostname: "localhost",
  port: 25565,
  socket: {
    data(socket, data) {
      const req = new McRequest(data);

      const packetLength = req.next();
      const packetId = req.next();
      if (packetId === PacketId.PING) {
        if (connectionState === 1) {
          const protocolVersion = req.readVarInt();
          const serverAddress = req.readString();
          const serverPort = req.readShortInt();
          const nextState = req.readVarInt();

          // its possible for the two handshake packets to come as one
          const hasNextPacket = req.next() != null;
          if (hasNextPacket && req.next() === PacketId.PING) {
            sendServerInfo(socket);
            return;
          }
          connectionState = nextState;
        } else {
          sendServerInfo(socket);
        }
      }
    },
  },
});

function sendServerInfo(socket: Socket) {
  const res = new McResponse();

  const serverInfo = JSON.stringify(SERVER_INFO);
  const packetLengthVarInt = intToVarInt(serverInfo.length + 1);

  res.writeVarInt(serverInfo.length + packetLengthVarInt.length + 1);
  res.writeVarInt(0);

  res.writeString(serverInfo);
  socket.write(res.getBuffer());
}
