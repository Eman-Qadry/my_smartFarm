exports.logged=(req,res,next)=>{
    if (!req.session.loggedIn){
        res.redirect('login')
    }
    next();
}