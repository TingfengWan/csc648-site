function account(){

    alert("acc")
    fetch('')
    .then(data =>{
        return data.json();
    })
    .then({

    })
    .catch((err)=>console.log(err))

}