const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;


// ------------- Validations 
const isValidEmail = (email) => {
    return emailRegex.test(email)
}




module.exports = { isValidEmail }