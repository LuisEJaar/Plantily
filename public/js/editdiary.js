const editDiaryPage = {
    pageSetup: ()=> {
        const submitButton = document.getElementById("editSubmit")
        submitButton.addEventListener("click", editDiaryPage.editFunction)
    },

    editFunction: async ()=> {
        try {
            const response = await fetch("/editdiary", {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'id': document.getElementById("_id").value,
                    "height": document.getElementById("plant_height").value,
                    "date": document.getElementById("plant_date").value,
                    "notes": document.getElementById("plant_notes").value,
                    "note": document.getElementById("note").value
                })
            })
            location.assign("/")
        } catch(err) {
            console.log(err)
        }
    },
}

editPlantPage.pageSetup()