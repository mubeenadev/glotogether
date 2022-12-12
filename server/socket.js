const { getMessages, insertNewMessage, getUserInfo } = require("./db");

module.exports = (io) => {
    let loggedUser = [];
    try {
        io.on("connection", async (socket) => {
            console.log(`socket with the id ${socket.id} is now connected`);
            var userId = socket.request.session.user_id;

            loggedUser.push({ userId, socketId: socket.id });

            //friend request notification
            socket.on("Friendrequest", async (receiverId) => {
                console.log(
                    "sender, recieverID",
                    socket.request.session.user_id,
                    receiverId
                );
                let reciever = loggedUser.find((user) => {
                    return user.userId == receiverId;
                });

                if (reciever) {
                    let sender = await getUserInfo(
                        socket.request.session.user_id
                    );
                    io.to(reciever.socketId).emit(
                        "newRequest",
                        `New friend request from ${sender.firstname}${sender.lastname}`
                    );
                }
            });

            //online user list
            emitOnlineuserlist(loggedUser, socket);

            try {
                let message = await getMessages();
                socket.emit("chatMessage", message);
            } catch (err) {
                console.log("Error : ", err.message);
            }

            socket.on("message", async (data) => {
                console.log("Button from client clicenk", data);
                try {
                    let message = await insertNewMessage(userId, data);
                    console.log("messahe db", message);
                    io.emit("newMessage", message);
                } catch (err) {
                    console.log("Error : ", err.message);
                }
            });

            socket.on("disconnect", function () {
                counter = 0;
                console.log(
                    `socket with the id ${socket.id} is now disconnected`
                );
                loggedUser = loggedUser.filter((user) => {
                    return user.socketId !== socket.id;
                });
                emitOnlineuserlist(loggedUser, socket);
            });
        });
    } catch (err) {
        console.log("Error : ", err.message);
    }
    const emitOnlineuserlist = (logged, socket) => {
        console.log("blaaa", socket.request.session);
        try {
            let onlineUser = logged.filter(
                (user, index, self) =>
                    index ===
                    self.findIndex(
                        (t) =>
                            t.userId === user.userId &&
                            t.userId !== socket.request.session.user_id
                    )
            );

            console.log("onlpinoe noe", onlineUser);

            let onlineuserdata = onlineUser.map(async (user) => {
                return await getUserInfo(user.userId);
            });

            Promise.all(onlineuserdata).then((results) => {
                console.log("uhuh", results);
                io.to(socket.id).emit("onlineuser", results);
            });
        } catch (err) {
            console.log("ee", err.message);
        }
    };
};
