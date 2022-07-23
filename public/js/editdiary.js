const diaryFlow = {
    Pagesetup: ()=> {
        const editDiaries = document.querySelectorAll(".editDiary")

        for(editDiary of editDiaries){
            editDiary.addEventListener("click", diaryFlow.editDiary)
        }
    },
    editDiary: async (e) => {
        const plantId = e.target.parentNode.children
        const diaryNum = e.target.parentNode.children
        console.log(e)
        try {
            const response = await fetch(`/editDiary/${plantId}/${diaryNum}`, {
                method: 'get'
            }) 
        } catch(err) {
            console.log(err)
        }
    }
}

diaryFlow.Pagesetup()