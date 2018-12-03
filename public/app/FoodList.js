export function FoodList(foods){
  //console.log(this);
    return `
    <ul class="foodlist">  
      ${foods.map(food => '<li onclick="app.addFood('+food.id+')"><img src="'+food.imgLocation+'" height="64" width="64"><p>'+food.name+'</p></li>').join('')}
    </ul>
    `
}