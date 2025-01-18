const getUserHomePage = (req, res) => {
    const user = req.user;
    const token = req.cookies?.token;
    return res.send(
        `Your name is: ${user.name}<br>Your email is: ${user.email}<br>Your token is: ${token}<br><br><a href="/auth/logout">Logout</a>`,
    );
};

export { getUserHomePage };
