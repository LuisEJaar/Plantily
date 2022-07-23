const editPlantPage = {
    pageSetup: ()=> {
        const submitButton = document.getElementById("editSubmit")
        submitButton.addEventListener("click", editPlantPage.editFunction)
    },

    editFunction: async ()=> {
        try {
            const response = await fetch("/editplant", {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'id': document.getElementById("_id").value,
                    "name": document.getElementById("plant_name").value,  
                    "plant_date": document.getElementById("plant_date").value,
                    "type": document.getElementById("plant_type").value,
                    "height": document.getElementById("plant_height").value,
                    "sun_exposure": document.getElementById("sun").value,
                    "watering_schedule": document.getElementById("watering").value
                })
            })
            location.assign("/")
        } catch(err) {
            console.log(err)
        }
    },
}

editPlantPage.pageSetup()