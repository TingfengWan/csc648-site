function displayUploadFileEle() {

    var uploadFileEle = document.getElementById("upload-div");
    if(uploadFileEle.style.display != "none") {
        uploadFileEle.style.display = "none";
    }

    else {
        uploadFileEle.style.display = "";
    }
}