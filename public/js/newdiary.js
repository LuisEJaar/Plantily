const editPlantPage = {
    pageSetup: ()=> {
        const submitButton = document.getElementById("addToDiary")
        submitButton.addEventListener("click", editPlantPage.addToDiaryFunction)
        document.getElementById("date").valueAsDate = new Date()
    },

    addToDiaryFunction: async ()=> {
        console.log(document.getElementById("plant_name").value)
        console.log(document.getElementById("plant_height").value)
        console.log(document.getElementById("plant_notes").value)
        try {
            const response = await fetch("/addToDiary", {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'id': document.getElementById("plant_name").value,
                    "date": document.getElementById("date").value,
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