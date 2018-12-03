export function FoodCartList(foodcart){
      return `
      <ul id="selected-food">
        ${foodcart.map(food => '<li><h3>'+food.name+'<i onclick="app.deleteFoodFromList('+food.id+')" class="icon-remove"></i> <span>$'+food.prize+'</span></h3></li>').join('')}
      </ul>
      `
  }