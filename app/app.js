
import { TablesList } from './TablesList.js'
import { FoodList } from './FoodList.js'
import { FoodCartList } from './FoodCartList.js'

export class App {
    constructor(id){
      this.rootElement = document.getElementById(id)
      this.state = {
       tables: [],
       foods: [],
       foodcart: [],
       CartPrize: 0
      }
      this.tableSelected = false
    }

    setState(state){
        this.state = state;
        this.refresh()
    }

    async componentDidMount(){
        let tabledata = await fetch('./app/tables.json')
        let tables = await tabledata.json()
        let fooddata = await fetch('./app/foods.json')
        let foods = await fooddata.json()
        this.setState({ tables: [ ...tables] ,foods: [ ...foods ], foodcart: [], CartPrize: 0 })
    }

    selectTable(tablePointer, selectedTable){
        var li = document.querySelectorAll(".allTables li");
        for (let i = 0; i < li.length; i++) {
            li[i].classList.remove('active')
        }
        tablePointer.classList.add('active');
        this.tableSelected = true;
        document.getElementById("tableNumber").children[0].textContent = selectedTable
    }
    
    addFood(foodID){
        if(this.tableSelected == false){
            alert("Select a table first!!");
            return;
        }
        let fooditem = {
         id: +new Date()
        }
        fooditem.name = this.state.foods.find(obj => obj.id == foodID).name;
        fooditem.prize = this.state.foods.find(obj => obj.id == foodID).prize;
        this.setState( {  tables: [ ...this.state.tables] ,foods: [ ...this.state.foods],
             foodcart: [ ...this.state.foodcart, fooditem ], CartPrize: app.setTotalPrize(fooditem.prize)})
    }

    setTotalPrize(totalprize){
        totalprize = totalprize + this.state.CartPrize;
        return totalprize;
    }

    deleteFoodFromList(idToDelete){
        let newfoodCartPrize =  this.state.CartPrize - this.state.foodcart.find(obj => obj.id == idToDelete).prize;
        let newfoodCart = this.state.foodcart.filter( e => e.id !== parseInt(idToDelete))
        this.setState({ tables: [ ...this.state.tables] ,foods: [ ...this.state.foods ], foodcart: [...newfoodCart], CartPrize: newfoodCartPrize })
    }

    refresh(){
        if(this.tableSelected == false){
            document.getElementById("table").children[1].innerHTML = TablesList(this.state.tables)
        }
        document.getElementById("menu").children[0].innerHTML = FoodList(this.state.foods)
        document.getElementById("selected-food").innerHTML = FoodCartList(this.state.foodcart)
        document.getElementById("total").children[0].children[0].innerHTML = '$'+this.state.CartPrize
    }    

    render() {
        this.rootElement.innerHTML = `
		<h1>SnacksBar App</h1>
		<hr>
		<div class="row">
			<div class="span4">
				<div id="table" class="clearfix">
                    <h2 id="tableHeading">Tables</h2>
                    <ul class="allTables"> ${TablesList(this.state.tables)} </ul>
					
				</div>
			</div>
			<div class="span8">
				<div id="order">

				<h2>Select a table on left</h2>
				<div class="row">
					<div class="span2">
						<div id="menu">
							
                        <ul>
                            ${FoodList(this.state.foods)}
                        </ul>
								
						</div>						
					</div>
					<div class="span6">
						<div id="details">
							<h2 id="tableNumber">Table <span>0</span></h2>
							<ul id="intro">
								<li id="default">
									<h3>Click a food to add it</h3>
								</li>
							</ul>
							<ul id="selected-food"></ul>
                            ${FoodCartList(this.state.foodcart)}							
							<ul>
								<li id="total">
									<h3>Total <span>${this.state.CartPrize}</span></h3>
								</li>
							</ul> 
						</div>
					</div>
				</div>
				</div>
			</div>
		</div>`
      }

}