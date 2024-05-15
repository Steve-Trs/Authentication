const InputType = {
  email: 0,
  password: 1,
  text: 2,
  number: 3,
};

const ErrorInput = {
  noError: 0,
  errorLength: 1,
  errorEmail: 2,
  errorPassword: 3,
};

function controlValueInput(type, value, length = 1) {
  if (value.length < length) return ErrorInput.errorLength;

  if (type == InputType.email && !validateEmail(value)) {
    return ErrorInput.errorEmail;
  }

  if (type == InputType.password && !validatePassword(value)) {
    return ErrorInput.errorPassword;
  }

  return ErrorInput.noError;
}
function validateEmail(string) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(string).toLowerCase());
}

/* 1 maj - 1 min - 1 digit - 1 caractere special : @$!%*?&§ */
function validatePassword(string) {
  var re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&§#])[A-Za-z\d@$!%*?&§#]{3,}$/;
  return re.test(String(string));
}

function validatePin(pin) {
  return /^[0-9]{4}$/.test(pin);
}

module.exports = {
  controlValueInput: controlValueInput,
  InputType: InputType,
  ErrorInput: ErrorInput,
  validatePin: validatePin,
  validatePassword: validatePassword,
};
