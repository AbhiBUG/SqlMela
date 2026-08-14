export const checkLoggedIn = (req,res,next)=>{
     console.log("Session ID:", req.sessionID);
    console.log("Session:", req.session);
    console.log("User:", req.session.user);
    if(req.session.user)
    {
        console.log("user generated");
        next()
    }
    else{
                return res.status(401).json({
            error: "You must be logged in"
        });
    }
}