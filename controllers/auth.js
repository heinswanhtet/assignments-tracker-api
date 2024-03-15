const register = async (req, res) => {
    res.send('This is register')
}

const login = async (req, res) => {
    res.send('This is login')
}

module.exports = {
    register,
    login
}