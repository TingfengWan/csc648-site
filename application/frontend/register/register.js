function validateFields() {

    var firstNameField = "first-name-field";
    var lastNameField = "last-name-field";
    var passwordField = "password-field";
    var confirmPasswordField = "confirm-password-field";
    var fields = document.getElementById("register-form").elements;
    var valid = true;

    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];

        if(field.type == "text") {
            if (field.id == firstNameField) {
                if (field.value == "") {
                    field.style.border = "1px solid red";
                    document.getElementById("first-name-error").innerHTML = "Please enter a first name.";
                    valid = false;
                }
                else {
                    field.style.border = "";
                    document.getElementById("first-name-error").innerHTML = "";
                }
            }
    
            else if (field.id == lastNameField) {
                if (field.value == "") {
                    field.style.border = "1px solid red";
                    document.getElementById("last-name-error").innerHTML = "Please enter a last name.";
                    valid = false;
                }
                else {
                    field.style.border = "";
                    document.getElementById("last-name-error").innerHTML = "";
                }
            }

        }

        else if (field.type == "email") {
            if (!field.value.includes("@sfsu.edu") && !field.value.includes("@mail.sfsu.edu")) {
                field.style.border = "1px solid red";
                document.getElementById("email-error").innerHTML = "Please enter a valid email.";
                valid = false;
            }

            else {
                field.style.border = "";
                document.getElementById("email-error").innerHTML = "";
            }
        }

        else if (field.type == "password") {
            if (fields[passwordField].value != fields[confirmPasswordField].value) {
                field.style.border = "1px solid red";
                document.getElementById("password-error").innerHTML = "Passwords do not match.";
                valid = false;
            }

            else if (field.value == "") {
                field.style.border = "1px solid red";
                document.getElementById("password-error").innerHTML = "Please enter a password.";
                valid = false;
            }

            else {
                field.style.border = "";
                document.getElementById("password-error").innerHTML = "";
            }
        }

        else if (field.type == "checkbox") {
            if(field.checked == false) {
                field.style.border = "1px solid red";
                document.getElementById("terms-and-cond-error").innerHTML = "Please accept terms and conditions";
                valid = false;
            }

            else {
                field.style.border = "";
                document.getElementById("terms-and-cond-error").innerHTML = "";
            }

        }
    }

    return valid;
}