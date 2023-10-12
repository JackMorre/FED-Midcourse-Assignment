const rightArrow = document.querySelector(".right");

const leftArrow = document.querySelector(".left");

const container = document.querySelector(".picks-inner");

const cardArray = document.querySelectorAll(".card");

const changeBtn = document.querySelector(".change");

const allDrinks = document.querySelectorAll(".drink-card");

const drinksContainer = document.querySelector(".drinksContainer");

function changeCarouselWidth() {
  if (this.window.innerWidth >= 550) {
    container.style.width = `${550 * cardArray.length}px`;
  } else if (this.window.innerWidth < 550) {
    container.style.width = `${cardArray.length}00vw`;
  }
}

leftArrow.style.display = "none";

changeCarouselWidth();

function randonNumber(number) {
  return Math.floor(Math.random() * number);
}

async function getAPI(webAddressStr, param = 0) {
  //   const url = "https://the-cocktail-db.p.rapidapi.com/randomselection.php";
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       "X-RapidAPI-Key": "4ef4ff2aa1mshc058d32cee8d29dp1a5b52jsnfd5943f08fc1",
  //       "X-RapidAPI-Host": "the-cocktail-db.p.rapidapi.com",
  //     },
  //   };

  try {
    const response = await fetch(webAddressStr);
    const result = await response.json();
    return result.drinks[randonNumber(10)];
  } catch (error) {
    console.error(error);
  }
}

// async function getAPI(webAddressStr, param = 0) {
//   const url = `${webAddressStr}${param}`;
//   console.log(url);
//   const options = {
//     method: "GET",
//     headers: {
//       "X-RapidAPI-Key": "4ef4ff2aa1mshc058d32cee8d29dp1a5b52jsnfd5943f08fc1",
//       "X-RapidAPI-Host": "the-cocktail-db.p.rapidapi.com",
//     },
//   };

//   try {
//     console.log(webAddressStr, param);
//     const response = await fetch(url, options);
//     const result = await response.json();
//     return result.drinks[randonNumber(10)];
//   } catch (error) {
//     console.error(error);
//   }
// }

async function updateRandomiser(webAddress, param) {
  let addedDrinks = [];
  let count = 0;
  let number = 4;
  for (let n = 0; n < number; n++) {
    const obj = await getAPI(webAddress, param);
    if (addedDrinks.length === 0) {
      changeCard(obj, count);
      addedDrinks.push(obj.strDrink);
      count++;
    } else {
      if (addedDrinks.includes(obj.strDrink)) {
        number++;
        continue;
      } else if (!addedDrinks.includes(obj.strDrink)) {
        changeCard(obj, count);
        addedDrinks.push(obj.strDrink);
        count++;
      } else {
        break;
      }
    }
  }
}

function changeCard(obj, n) {
  const card = drinksContainer.querySelector(`[data-number="${n + 1}"]`);
  const drinkTitle = card.querySelector(".drink-title");

  const drinkImg = card.querySelector(".drink-img");

  card.setAttribute("data-id", obj.idDrink);

  drinkTitle.textContent = obj.strDrink;
  drinkImg.setAttribute("src", obj.strDrinkThumb);
  drinkImg.setAttribute("alt", `image of ${obj.strDrink}`);
}

// updateRandomiser(
//   "https://the-cocktail-db.p.rapidapi.com/filter.php?a=",
//   "Alcoholic"
// );

updateRandomiser("./APIcall.json");

changeBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  updateRandomiser("./APIcall.json");
});

async function getIngrediants() {
  const obj = await getAPI();

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
}

//gets the divided amountmso each card can fit
const dividedNumber = 100 / Number(cardArray.length);
//create currentcard and final number varibles outside scope
let currentCard = "";
let finalNumber = "";

//creating function for clicking arrows
const clickArrow = (str) => {
  let cardNumber = "";
  // making sure arrows are availble to press at start of click
  rightArrow.style.display = "block";
  leftArrow.style.display = "block";

  //this if statment cicles through all of the cards availble
  for (let i = 0; i < cardArray.length; i++) {
    //each time we go through we get a card from card array to grab the card variable.
    const card = cardArray[i];
    //we then grab the attribute from the current card to see if its current on it.
    const boolion = card.getAttribute("data-viewing");
    if (boolion == "true") {
      // if true, we change the attribute to false as it will no longer be true and on the card.
      card.setAttribute("data-viewing", "false");
      //depending on which arrow is clicked will either select the previous one in the array or next to allow for the attribute to be turned to true.
      if (str === "left") {
        cardArray[i - 1].setAttribute("data-viewing", "true");
      } else if (str === "right") {
        cardArray[i + 1].setAttribute("data-viewing", "true");
      }
      //make sure current card has true setting in the attribute
      currentCard = cardArray[i];
      break;
    }
  }
  if (str === "left") {
    //grabs card number from data number attribute
    cardNumber = Number(currentCard.getAttribute("data-number")) - 1;
    finalNumber -= dividedNumber;
  } else if (str === "right") {
    cardNumber = Number(currentCard.getAttribute("data-number")) + 1;
    finalNumber = dividedNumber * cardNumber;
  }

  container.style.transform = `translateX(-${finalNumber}%)`;

  if (cardNumber === 0) {
    leftArrow.style.display = "none";
  } else if (cardNumber + 1 === cardArray.length) {
    rightArrow.style.display = "none";
  }
};

leftArrow.addEventListener("click", (e) => {
  e.preventDefault();
  clickArrow("left");
});

rightArrow.addEventListener("click", (e) => {
  e.preventDefault();
  clickArrow("right");
});

window.addEventListener("resize", function (e) {
  e.preventDefault();

  if (this.window.innerWidth >= 550) {
    container.style.width = `${550 * cardArray.length}px`;
  } else if (this.window.innerWidth < 550) {
    container.style.width = `${cardArray.length}00vw`;
  }
});
