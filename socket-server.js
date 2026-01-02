const { Server } = require("socket.io");
const { createServer } = require("http");

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*", // 개발 편의를 위해 모든 출처 허용 (배포 시 수정 필요)
        methods: ["GET", "POST"]
    }
});

// 온라인 사용자 추적 (userId -> socketId)
const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // 사용자가 접속했을 때 (로그인 후)
    socket.on("join", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} joined with socket ${socket.id}`);

        // 모든 클라이언트에게 온라인 사용자 목록 브로드캐스트
        io.emit("online_users", Array.from(onlineUsers.keys()));
    });

    // 메시지 전송
    socket.on("send_message", (data) => {
        const { receiverId, content, senderId, senderName, messageId } = data;
        const receiverSocketId = onlineUsers.get(receiverId);
        const senderSocketId = onlineUsers.get(senderId);

        const messageData = {
            id: messageId || Date.now().toString(),
            content,
            senderId,
            senderName,
            createdAt: new Date().toISOString(),
        };

        // 받는 사람에게 메시지 전송
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive_message", {
                ...messageData,
                isMyMessage: false
            });
        }

        // 보낸 사람에게도 확인 메시지 전송 (실시간 업데이트용)
        if (senderSocketId) {
            io.to(senderSocketId).emit("message_sent", {
                ...messageData,
                receiverId,
                isMyMessage: true
            });
        }
    });

    // 연결 해제
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);

        // 사용자 목록에서 제거
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }

        // 업데이트된 목록 브로드캐스트
        io.emit("online_users", Array.from(onlineUsers.keys()));
    });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`);
});
