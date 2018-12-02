export function FoodCartList(foodcart){
    //console.log(this);
      return `
        ${foodcart.map(food => '<li><h3>'+food.name+'<i onclick="app.deleteFoodFromList('+food.id+')" class="icon-remove"></i> <span>$'+food.prize+'</span></h3></li>').join('')}
      
      `
  }