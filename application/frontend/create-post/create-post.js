function createPost() {
    event.preventDefault();

    let title = document.forms["create-post"]["title"].value;
    let category = document.forms["create-post"]["category"].value;
    let price = document.forms["create-post"]["price"].value;
    let physical = document.forms["create-post"]["physical"].checked;
    let description = document.forms["create-post"]["description"].value;
    let fileUpload = document.forms["create-post"]["file-upload"];
    let imagePreview = document.forms["create-post"]["image"];
    let location = document.forms["create-post"]["location"].value;
    let createTime = new Date();
    let fileName;
    let creatorEmail = "test@sfsu.edu"; //test email, to be replaced with current user logged in

    console.log(location);
    if (validatePost()) {
        let formData = new FormData(); //holds all the data from the form

        //physical objects cannot have a file upload
        if (physical == true) {
            fileName = "";
        }

        else {
            fileName = fileUpload.files[0].name;
        }

        formData.set("id", 1);
        formData.set("creator_email", creatorEmail);
        formData.set("create_time", createTime.toISOString());
        formData.set("title", title);
        formData.set("cost", price);
        formData.set("has_file", physical);
        formData.set("file_name", fileName);
        formData.set("media_preview", imagePreview.files[0]);
        formData.set("media_content", fileUpload.files[0]);
        formData.set("post_body", description);
        formData.set("is_approved", 0);
        formData.set("approver_email", null);
        formData.set("locations", JSON.stringify([location]));
        formData.set("categories", JSON.stringify([category]));


        axios.post('http://3.22.78.154:3000/post', formData)
            .then((res) => {
                console.log(res.data);
                console.log(res.data.status);

                window.location = "create-post-success.html";
                
            })
            .catch((err) => {
                alert("There was an issue processing your post. Please try again.");
                console.log(err)
            });
            
    }


}

/**
 * checks for any invalid or empty fields
 * if the input is invalid it will put a red border around the input
 * and display an error message
 * else the red border and error message are removed
 */
function validatePost() {

    let fields = document.getElementById("create-post").elements;
    let valid = true;
    let physical = false;

    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        let errorMsg = "";
        field.style.border = "";

        if (field.type == "checkbox") {
            if (field.checked == true) {
                physical = true;
            }
            else {
                physical = false;
            }
        }

        else if (field.type == 'file' && field.id == "file-upload") {

            if (physical == false && field.value.length == 0) {
                document.getElementById("file-upload-div").style.border = "1px solid red";
                errorMsg = "Please select a file to upload";
                valid = false;
            }

            else {
                document.getElementById("file-upload-div").style.border = "";
            }

            document.getElementById("file-upload-error").innerHTML = errorMsg;
        }


        else if (field.id == "location" && physical == true) {
            if (field.value.length == 0) {
                field.style.border = "1px solid red";
                errorMsg = "Please select a meetup location";
                valid = false;
            }

            document.getElementById("location-error").innerHTML = errorMsg;
        }

        else if (field.hasAttribute("required")) {

            if (field.type == "number") {
                let price = field.value;

                if (price < 0) {
                    field.style.border = "1px solid red";
                    errorMsg = "Please enter a valid price";
                    valid = false;
                }

                else if (isNaN(price) || price.length == 0) {
                    field.style.border = "1px solid red";
                    errorMsg = "Please enter a price";
                    valid = false;
                }

                document.getElementById("price-error").innerHTML = errorMsg;
            }

            else {
                let trimmedInput = field.value.trim();
                if (trimmedInput.length == 0) {
                    field.style.border = "1px solid red";
                    errorMsg = "Please enter a " + field.name;
                    valid = false;
                }

                if (field.id == "title") {
                    document.getElementById("title-error").innerHTML = errorMsg;
                }

                else if (field.id == "category") {
                    document.getElementById("category-error").innerHTML = errorMsg;
                }

            }


        }

    }
    return valid;

}

/**
 * pulls the categories from the database and 
 * puts them into the categories select tag
 */
function getCategories() {
    let URL = "http://3.22.78.154:3000/post/categories";

    fetch(
        URL
    )
        .then(data => {
            return data.json();
        })
        .then(function (data) {
            const categories = data.categories;
            const categoriesSelect = document.getElementById("category");

            for (let i = 0; i < categories.length; i++) {
                let node = document.createElement("option");
                node.value = categories[i].category;
                let text = document.createTextNode(categories[i].category);
                node.appendChild(text);
                categoriesSelect.appendChild(node);
            }
        })
        .catch(err => {
            console.log(err);
        });
}


/**
 * if the item is a physical object, hides the
 * upload file option in the form
 */
function displayUploadFileDiv() {

    const physicalField = document.getElementById("physical");
    const uploadFileEle = document.getElementById("file-upload-div");
    const fileErrorDiv = document.getElementById("file-upload-error");
    const locationDiv = document.getElementById("location-div");

    if (physicalField.checked == true) {
        uploadFileEle.hidden = true;
        fileErrorDiv.hidden = true;

        locationDiv.hidden = false;
    }

    else {
        uploadFileEle.hidden = false;
        fileErrorDiv.hidden = false;

        locationDiv.hidden = true;
    }
}

/**
 * detects a change in the file upload field for image preview
 * if there is a change it will check and load the file into a div
 */
function displayImagePreview() {
    const imgPreview = document.getElementById("image-preview");
    const imgPreviewTxt = document.getElementById("image-preview-text");
    const file = document.getElementById("image").files[0];

    const reader = new FileReader();

    reader.addEventListener("load", function () {
        imgPreview.src = reader.result;
        imgPreviewTxt.textContent = "";
    });
    if (file) {
        reader.readAsDataURL(file);
    }

}