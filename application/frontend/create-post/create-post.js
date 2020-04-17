function displayUploadFileEle() {

    var uploadFileEle = document.getElementById("upload-div");
    if(uploadFileEle.style.display != "none") {
        uploadFileEle.style.display = "none";
    }

    else {
        uploadFileEle.style.display = "";
    }
}

function displayImagePreview() {
    var imgPreview = document.getElementById("image-preview");
    var file = document.getElementById("image").files[0];
    
    const reader = new FileReader();

    reader.addEventListener("load", function() {
        imgPreview.src = reader.result;

        });
        if (file) {
            reader.readAsDataURL(file);
        }

}