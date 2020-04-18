//http://3.22.78.154:3000/user/signup

function validateFields() {

    const firstNameField = "first-name-field";
    const lastNameField = "last-name-field";
    const passwordField = "password-field";
    const confirmPasswordField = "confirm-password-field";
    let fields = document.getElementById("register-form").elements;
    let valid = true;
    
    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        let errorMsg = "";
        field.style.border = "";

        if (field.type == "text") {
            if (field.value.trim().length == 0) {
                errorMsg = "Please enter a " + field.name + ".";
                field.style.border = "1px solid red";
                valid = false;
            }
            
            if (field.id == firstNameField) {
                document.getElementById("first-name-error").innerHTML = errorMsg;
            }
            if (field.id == lastNameField) {
                document.getElementById("last-name-error").innerHTML = errorMsg;
            }
        }

        else if (field.type == "email") {
            if (!field.value.includes("@sfsu.edu") && !field.value.includes("@mail.sfsu.edu")) {
                field.style.border = "1px solid red";
                errorMsg = "Please enter a valid " + field.name + ".";
                valid = false;
            }

            document.getElementById("email-error").innerHTML = errorMsg;
        }

        else if (field.type == "password") {


            if(field.value.indexOf(" ") !== -1) {
                field.style.border = "1px solid red";
                errorMsg = "Please enter a valid password. (Passwords cannot contain spaces)";
                valid = false;
            }

            else if (field.value.length == 0) {
                field.style.border = "1px solid red";
                errorMsg = "Please enter a password.";
                valid = false;
            }

            else if (fields[passwordField].value != fields[confirmPasswordField].value) {
                field.style.border = "1px solid red";
                errorMsg = "Passwords do not match.";
                valid = false;
            }
            document.getElementById("password-error").innerHTML = errorMsg;
        }

        else if (field.type == "checkbox") {
            if (field.checked == false) {
                field.style.border = "1px solid red";
                errorMsg = "Please accept " + field.name + ".";
                valid = false;
            }

            document.getElementById("terms-and-cond-error").innerHTML = errorMsg;
        }
    }
    return valid;
}
