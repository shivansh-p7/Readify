const isValidName = function(name){
    const regexname =  /^([a-z  A-Z]){2,30}$/;
    return regexname.test(name)
}

const isValidEmail = function(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[com]+)*$/;
    return emailRegex.test(email);
};

const isValidPassword = function (password) {
    const passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/
    return passwordRegex.test(password);
};

const isValidPhone=function (phone){
    const mobileRegex=/^[6-9]{1}[0-9]{9}$/
    return  mobileRegex.test(phone);
}

const isValidExcerpt = function(excerpt){
    const regexExept=  /^([a-z  A-Z]){2,60}$/;
    return regexExept.test(excerpt)
}

const isValidTitle = function(title){
   const regexname =  /^([a-z  A-Z 0-9]){2,30}$/;
   return regexname.test(title)
}



module.exports={isValidPassword,isValidEmail,isValidName,isValidPhone,isValidExcerpt,isValidTitle}