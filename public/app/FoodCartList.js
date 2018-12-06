export function FoodCartList(foodcart){
  if(foodcart.length !== 0){
    
    return `
      <ul id="selected-food">
        ${foodcart.map(food => '<li><h3>' + food.name + '<i onclick="app.deleteFoodFromList(' + food.id +','+food.addedTimes+ ')" class="icon-remove"></i> <span class="multiple">X ' + food.addedTimes +'</span><span id="price">$' + food.prize + '</span></h3></li>').join('')}
      </ul>
      `
  }else{
    return `
    <ul id="selected-food">
      <li>Food cart is empty...</li>
    </ul>
    `
  }
}