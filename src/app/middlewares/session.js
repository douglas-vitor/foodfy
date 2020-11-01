function onlyUsers(req, res, next) {
    if(!req.session.userId) {
        return res.redirect("/login")
    }
    next()
}

function isLoggedRedirectToUsers(req, res, next) {
    if(req.session.userId) {
        return res.redirect("/admin/")
    }

    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers
}