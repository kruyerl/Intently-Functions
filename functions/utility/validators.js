const isEmail = (email) => {
    // eslint-disable-next-line no-useless-escape
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email.match(regEx)) return true
    else return false
}
const isEmpty = (string) => {
    if (string.trim() === '') return true
    else return false
}

exports.validateReset = email => {
    let errors = {}
    if (isEmpty(email)) {
      errors.email = "Must not be empty";
    } else if (!isEmail(email)) {
      errors.email = "Must be a valid email address";
    }
    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
}

exports.validateSignupData = (data)=>{
    let errors = {}

    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty'
    } else if (!isEmail(data.email)) {
        errors.email = 'Must be a valid email address'
    }
    if (isEmpty(data.password)) errors.password = 'Must not be empty'
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match'
    if (isEmpty(data.username)) errors.username = 'Must not be empty'
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }

}

exports.validateLoginData = (data) => {
    let errors = {}
    if (isEmpty(data.email)) errors.email = 'Must not be empty'
    else if (!isEmail(data.email)) errors.email = 'Must be a valid email address'
    if (isEmpty(data.password)) errors.password = 'Must not be empty'
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}
