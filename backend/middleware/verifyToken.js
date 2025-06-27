import jwt from "jsonwebtoken";

 export const verifyToken = async (req, resp, next) => {
    try {
        const bearerHeader = req.header("Authorization");
        console.log("Authorization Header:", bearerHeader); 
        if (!bearerHeader) {
            return resp.status(403).json({ message: "Access Denied" });
        }
        else {
            const bearer = bearerHeader.split(" ");
            const token = bearer[1]; //the token is the second object after splitting
            const ifVerified=jwt.verify(token,process.env.JWT_SECRET);
            req.user = ifVerified;
            console.log(req.user);
            next();
        }
    }
    catch(error){
        console.log("error in verifying token!", error);
        resp.status(500).json({error:error.message});
    }
};

export const verifySocketToken = (socket, next) => {
    const token = socket.handshake.auth.token; 

    if (!token) 
        return next(new Error("Access Denied: No Token Provided!")); 
    
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = user; // Attach user to socket (similar to request.user in Express)
        next(); // Allow connection
    } catch (error) {
        console.log("Socket Authentication Error:", error.message);
        return next(new Error("Invalid Token!")); 
    }
};
