Bun.listen({
  hostname: "localhost",
  port: 25565,
  socket: {
    data(socket, data) {
      const t = Array.from(
        new TextEncoder().encode(
          JSON.stringify({
            version: {
              name: "1.21.1",
              protocol: 767,
            },
            description: {
              text: "Hello, world!",
            },
            enforcesSecureChat: false,
          })
        )
      );
      socket.write(Buffer.from([t.length + 2, 0, t.length, ...t]));
    }, // message received from client
    open(socket) {}, // socket opened
    close(socket) {}, // socket closed
    drain(socket) {}, // socket ready for more data
    error(socket, error) {}, // error handler
  },
});

// [ 73, 0, 71, 123, 34, 118, 101, 114, 115, 105, 111, 110, 34, 58, 123, 34, 110, 97, 109, 101, 34, 58, 34, 49, 46, 50, 49, 46, 49, 34, 44, 34, 112, 114, 111, 116, 111, 99, 111, 108, 34, 58, 55, 54, 55, 125, 44, 34, 101, 110, 102, 111, 114, 99, 101, 115, 83, 101, 99, 117, 114, 101, 67, 104, 97, 116, 34, 58, 102, 97, 108, 115, 101, 125 ]
