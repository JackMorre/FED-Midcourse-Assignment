const allDrinkEl = document.querySelector(".drinksContainer");

const ingrediantsTableEl = document.querySelector("tbody");

const spanEl = document.getElementsByClassName("close")[0];

console.log(spanEl);

const modalObj = {
  name: document.querySelector("#drink-title"),
  type: document.querySelector("#drink-type"),
  description: document.querySelector("#instructions"),
  glass: document.querySelector("#glass-type"),
  image: document.querySelector("#img-api"),
};

console.log(modalObj.name);

async function getApiId(string) {
  //   const url = `https://the-cocktail-db.p.rapidapi.com/lookup.php?i=${string}`;
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       "X-RapidAPI-Key": "4ef4ff2aa1mshc058d32cee8d29dp1a5b52jsnfd5943f08fc1",
  //       "X-RapidAPI-Host": "the-cocktail-db.p.rapidapi.com",
  //     },
  //   };

  try {
    const response = await fetch(string);
    const result = await response.json();
    return result.drinks[0];
  } catch (error) {
    console.error(error);
  }
}

spanEl.onclick = function () {
  console.log("clicked");
  modal.style.display = "none";
};

allDrinkEl.addEventListener("click", async function (e) {
  e.preventDefault();
  const id = e.target.closest("[data-id]").getAttribute("data-id");

  const modal = document.getElementById("my-modal");

  modal.style.display = "block";

  window.onclick = function (e) {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  };
  const obj = await getApiId("./idFetch.json");

  let count = 1;
  let number = 1;
  const ingrediants = [];
  for (const key in obj) {
    // if (obj.hasOwnProperty(key)) {
    //   console.log(`${key}: ${obj[key]}`);
    // }
    if (obj[key] === null || obj[key] === "") {
      continue;
    } else if (key === `strIngredient${count}`) {
      ingrediants.push({ main: obj[key] });
      count++;
    } else if (key === `strMeasure${number}`) {
      ingrediants[number - 1].measure = obj[key];
      number++;
    } else {
      continue;
    }
  }

  updateIngrediants(ingrediants);

  modalObj.name.textContent = await obj.strDrink;
  modalObj.type.textContent = await obj.strAlcoholic;
  modalObj.description.textContent = await obj.strInstructions;
  modalObj.glass.textContent = await obj.strGlass;
  modalObj.image.setAttribute("src", obj.strDrinkThumb);
});

async function updateIngrediants(arr) {
  removeIngredients();
  for (let n = 0; n < arr.length; n++) {
    const tr = document.createElement("tr");
    const tdIngredient = document.createElement("td");
    const tdMeasurement = document.createElement("td");
    tdIngredient.textContent = arr[n].main;
    tdMeasurement.textContent = arr[n].measure;
    tr.appendChild(tdIngredient);
    tr.appendChild(tdMeasurement);
    ingrediantsTableEl.appendChild(tr);
  }
}

function removeIngredients() {
  const trEls = document.querySelectorAll("tr");
  const number = trEls.length;
  for (let o = 0; o < number; o++) {
    if (o === 0) {
      continue;
    } else {
      trEls[o].remove();
    }
  }
}
