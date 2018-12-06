export function FoodList(foods){
    return `
    <ul class="foodlist">  
      ${foods.map(food => '<li title="click multiple times to add more food item." onclick="app.addFood('+food.id+')"><img src="'+food.imgLocation+'" height="64" width="64"><p>'+food.name+'</p><p class="price">$'+food.prize+'</p></li>').join('')}
    </ul>
    `
}