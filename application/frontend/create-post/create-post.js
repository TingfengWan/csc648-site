function displayUploadFileDiv() {

    const physicalField = document.getElementById("physical-field");
    const uploadFileEle = document.getElementById("file-upload-div");
    const fileErrorDiv = document.getElementById("file-upload-error");

    if(physicalField.checked == true) {
        uploadFileEle.style.display = "none";
        fileErrorDiv.style.display = "none";
    }

    else {
        uploadFileEle.style.display = "";
        fileErrorDiv.style.display = "";
    }
}

function displayImagePreview() {
    const imgPreview = document.getElementById("image-preview");
    const imgPreviewTxt = document.getElementById("image-preview-text");
    const  file = document.getElementById("image").files[0];
    
    const reader = new FileReader();

    reader.addEventListener("load", function() {
        imgPreview.src = reader.result;
        imgPreviewTxt.textContent = "";
        });
        if (file) {
            reader.readAsDataURL(file);
        }

}

function validatePost() {

    let fields = document.getElementById("create-post-form").elements;
    let valid = false;
    let physical = false;

    console.log(fields);

    for(let i = 0; i < fields.length; i++) {
        let field = fields[i];
        let errorMsg = "";
        field.style.border = "";

        if(field.type == "checkbox") {
            if(field.checked == true) {
                physical = true;
            }
            else {
                physical = false;
            }
        }

        else if(field.type == 'file' && field.id == "file-upload") {
            
            if(physical == false && field.value.length == 0) {
                document.getElementById("file-upload-div").style.border = "1px solid red";
                errorMsg = "Please select a file to upload";
                valid = false;
            }

            else {
                document.getElementById("file-upload-div").style.border = "";
            }

            document.getElementById("file-upload-error").innerHTML = errorMsg;
        }

        else if(field.hasAttribute("required")) {
            valid = false;

            if(field.type == "number") {
                let price = field.value;

                if(price < 0) {
                    field.style.border = "1px solid red";
                    errorMsg = "Please enter a valid price";
                }
        
                else if(isNaN(price) || price.length == 0) {
                    field.style.border = "1px solid red";
                    errorMsg = "Please enter a price";
                }

                document.getElementById("price-error-field").innerHTML = errorMsg;
            }
        
            else {    
                let trimmedInput = field.value.trim();
                if(trimmedInput.length == 0) {
                    field.style.border = "1px solid red";
                    errorMsg = "Please enter a " + field.name;
                }

                if(field.id == "title-field") {
                    document.getElementById("title-error-field").innerHTML = errorMsg;
                }

                else if(field.id == "category-field") {
                    document.getElementById("category-error-field").innerHTML = errorMsg;
                }

                else if(field.id == "media-type-field") {
                    document.getElementById("media-error-field").innerHTML = errorMsg;
                }
            }


        }

    }
    return valid;

}


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
            const categoriesSelect = document.getElementById("category-field");

            for(let i = 0; i < categories.length; i++) {
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