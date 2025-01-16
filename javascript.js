const form = document.getElementById('form');
const input = document.getElementById('input');
const result = document.getElementById('search');
const details = document.getElementById('Details');
const cartContainer = document.getElementById('cart-main-container');
const cartCount = document.getElementById('count');


window.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
  const data = await response.json();
  if (data.meals) {
    display(data.meals.slice(0, 14));
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) {
    result.innerHTML = '<h1 style="color: red;">Not Found</h1>';
    return;
  }

  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await response.json();
  if (data.meals) {
    display(data.meals);
  } else {
    result.innerHTML = '<h1 style="color: red;">Not Found</h1>';
  }
});

const display = (meals) => {
  result.innerHTML = '';
  meals.forEach((meal) => {
    const youtubeLink = meal.strYoutube ? meal.strYoutube : '#';
    // const facebookLink = meal.strFacebook ? meal.strFacebook : '#';
    // const facebookTarget = meal.strFacebook ? '_blank' : '_self';
    const youtubeTarget = meal.strYoutube ? '_blank' : '_self';

    const mealCard = document.createElement('div');
    mealCard.className = 'meal-card';
    mealCard.innerHTML = `
      <img src="${meal.strMealThumb}" alt="" class="meal-image" />
      <h3>${meal.strMeal}</h3>
      <p><strong>Category:</strong> ${meal.strCategory}</p>
      <button onclick="Addtocart('${meal.strMealThumb}', '${meal.strMeal}', '${meal.strCategory}')">Add to Cart</button>
      <button onclick="show(${meal.idMeal})">Details</button>
      <div class="social-icons">
      <a href="${youtubeLink}" target="${youtubeTarget}">
        <i class="fab fa-youtube social-icon"></i>
      </a>


      </div>
    `;
    result.appendChild(mealCard);
  });
};


const show = async (mealId) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const data = await response.json();
  if (data.meals && data.meals.length > 0) {
    const meal = data.meals[0];
    showDetails(meal);
  }
};

const showDetails = (meal) => {
  details.innerHTML = `
    <div class="popup">
      <div class="popup-content">
        <h2>${meal.strMeal}</h2>
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
        <button onclick="closeDetailsPopup()">Close</button>
      </div>
    </div>
  `;
  details.style.display = 'block';
};

const closeDetailsPopup = () => {
  details.innerHTML = '';
  details.style.display = 'none';
};


const ingredients = (meal) => {
  let ingredients = '';
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      ingredients += `<li>${ingredient}</li>`;
    }
  }
  return ingredients;
};


const Addtocart = (mealThumb, mealName, mealCategory) => {
  const cartitems = cartContainer.getElementsByClassName('cart-info');
  if (cartitems.length >= 11) {
    alert('The cart is full.');
    return;
  }
  let item 
  for (item of cartitems) {
    if (item.querySelector('h3').innerText === mealName) {
      alert(`${mealName} is already in the cart.`);
      return;
    }
  }
  

  let count = parseInt(cartCount.innerText);
  cartCount.innerText = count + 1;

  const cartitem = document.createElement('div');
  cartitem.className = 'cart-info';
  cartitem.innerHTML = `
    <img src="${mealThumb}" alt="" class="meal-image" />
    <h3>${mealName}</h3>
    <p><strong>Category:</strong> ${mealCategory}</p>
  `;

  cartContainer.appendChild(cartitem);
};

