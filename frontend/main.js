
const inputForm = document.querySelector("#store-img")
const image = document.querySelector("#input")

inputForm.addEventListener("submit", async event => {
    event.preventDefault()
    const file = image.files[0]

    // get generated upload url from server
    const { url } = await fetch("/s3Url").then(res => res.json())
    console.log(url)

    // uploading image to S3
    await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        body: file
      })
    
      const imageUrl = url.split('?')[0]
      console.log(imageUrl)
      console.log("uploaded successfully")
          
    // show uploaded images to the user 
    let container = document.getElementById("show-images")
    const img = document.createElement("img")
    img.src = imageUrl
    container.appendChild(img)
    img.classList.add('image')
    img.classList.add('img-display')

})

