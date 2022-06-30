const editPlantPage = {
    pageSetup: ()=> {
        const submitButton = document.getElementById("addToDiary")
        submitButton.addEventListener("click", editPlantPage.addToDiaryFunction)
    },

    addToDiaryFunction: async ()=> {
        console.log("here")
        console.log(document.getElementById("plant_name").value)
        console.log(document.getElementById("plant_height").value)
        console.log(document.getElementById("plant_notes").value)
        try {
            const response = await fetch("/addToDiary", {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'id': document.getElementById("plant_name").value,
                    "plant_height": document.getElementById("plant_height").value,  
                    "plant_notes": document.getElementById("plant_notes").value
                })
            })
            location.assign("/")
        } catch(err) {
            console.log(err)
        }
    },

}

editPlantPage.pageSetup()