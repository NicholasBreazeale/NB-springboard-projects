function createCupcake(obj) {
  document.getElementById("cupcake-list").innerHTML += `<div><img src="${obj.image}" /><p>${obj.size} ${obj.flavor}, ${obj.rating}/10</p></div>`;
}

document.getElementById("cupcake-form").addEventListener("submit", async event => {
  event.preventDefault();
  let formInputs = [
    document.getElementById("flavor"),
    document.getElementById("size"),
    document.getElementById("rating"),
    document.getElementById("image")
  ];

  // Submit data
  let response = await axios.post("/api/cupcakes", {
    flavor: formInputs[0].value,
    size: formInputs[1].value,
    rating: formInputs[2].value,
    image: formInputs[3].value
  })
  createCupcake(response.data.cupcake);

  // Clear inputs
  for (const input in formInputs) {
    input.value = "";
  }
});

axios.get("/api/cupcakes").then(response => {
  for (const cupcake of response.data.cupcakes) {
    createCupcakes(cupcake);
  }
});