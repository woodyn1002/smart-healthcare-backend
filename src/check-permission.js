import User from "./models/user"

export function checkPermission(req, victim) {
    let isAdmin = req.token.decoded.isAdmin;
    if (victim === undefined) {
        return isAdmin;
    } else {
        let username = (victim instanceof User) ? victim.username : victim;
        return (isAdmin || req.token.decoded.username === username);
    }
}