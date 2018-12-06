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
       CartPrize: 0,
      }
      this.tableSelected = false,
      this.lastActiveTable = 1
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

        if (localStorage.getItem("lastActiveTable") !== null) {
            let lastActiveTable = JSON.parse(localStorage.getItem("lastActiveTable"));
            console.log(lastActiveTable);

            let tableOrder = "tableOrder-" + lastActiveTable
            if (localStorage.getItem(tableOrder) !== null) {
                let storedfoodcart = JSON.parse(localStorage.getItem(tableOrder));
                let storedCartPrize = storedfoodcart.map(item => item.prize).reduce((a, b) => a + b, 0);
                this.setState({
                    tables: [...this.state.tables], foods: [...this.state.foods],
                    foodcart: [...this.state.foodcart, ...storedfoodcart], CartPrize: storedCartPrize
                })

            }
            document.getElementById("tableNumber").children[0].textContent = lastActiveTable
            document.querySelector(".allTables").getElementsByTagName("li")[lastActiveTable-1].setAttribute("class", "active");
            this.tableSelected = true
        }
    }

    selectTable(tablePointer, selectedTable){
        var li = document.querySelectorAll(".allTables li");
        for (let i = 0; i < li.length; i++) {
            li[i].classList.remove('active')
        }
        tablePointer.classList.add('active');
        this.tableSelected = true;
        document.getElementById("tableNumber").children[0].textContent = selectedTable
        this.lastActiveTable = selectedTable
        localStorage.setItem("lastActiveTable", JSON.stringify(this.lastActiveTable)); 


        this.setState( {  tables: [ ...this.state.tables] ,foods: [ ...this.state.foods],
            foodcart: [], CartPrize: 0})
        let tableOrder = "tableOrder-"+selectedTable
        if (localStorage.getItem(tableOrder) !== null) {
            let storedfoodcart = JSON.parse(localStorage.getItem(tableOrder));
            let storedCartPrize = storedfoodcart.map(item => item.prize).reduce((a, b) => a + b, 0);
            this.setState( {  tables: [ ...this.state.tables] ,foods: [ ...this.state.foods],
                foodcart: [ ...this.state.foodcart, ...storedfoodcart ], CartPrize: storedCartPrize})
        }

    }
    
    addFood(foodID){
        if (this.tableSelected == false) {
            alert("Select a table first!!");
            return;
        }
        let tableNo = document.getElementById("tableNumber").children[0].textContent
        let tableOrder = "tableOrder-" + tableNo

        let tableOrderID = this.state.foodcart.map(obj => obj.id)
        let alreadyIncart = tableOrderID.includes(foodID);
        var result = this.state.foodcart.filter(obj => {
            return obj.id === foodID
        })

        if (alreadyIncart){

            result[0].addedTimes += 1 
            result[0].prize = result[0].addedTimes * this.state.foods.find(obj => obj.id == foodID).prize;
            let TotalCartPrize = this.state.foodcart.map(item => item.prize).reduce((a, b) => a + b, 0);

            this.setState({
                tables: [...this.state.tables], foods: [...this.state.foods],
                foodcart: [...this.state.foodcart], CartPrize: TotalCartPrize
            })


        }else{
            let fooditem = {
                id: foodID,
            }
            fooditem.name = this.state.foods.find(obj => obj.id == foodID).name;
            fooditem.addedTimes = 1,
            fooditem.prize = fooditem.addedTimes * this.state.foods.find(obj => obj.id == foodID).prize;
            
            this.setState({
                tables: [...this.state.tables], foods: [...this.state.foods],
                foodcart: [...this.state.foodcart, fooditem], CartPrize: app.setTotalPrize(fooditem.prize)
            })

        }

        localStorage.setItem(tableOrder, JSON.stringify(this.state.foodcart));      
    }

    setTotalPrize(totalprize){
        totalprize = totalprize + this.state.CartPrize;
        return totalprize;
    }

    deleteFoodFromList(idToDelete, addedTimes){

        if(addedTimes > 1){
            var result = this.state.foodcart.filter(obj => {
                return obj.id === idToDelete
            })
            result[0].addedTimes -= 1 
            result[0].prize = this.state.foodcart.find(obj => obj.id == idToDelete).prize - (this.state.foodcart.find(obj => obj.id == idToDelete).prize / addedTimes) ;
            let TotalCartPrize = this.state.foodcart.map(item => item.prize).reduce((a, b) => a + b, 0)

            this.setState({
                tables: [...this.state.tables], foods: [...this.state.foods],
                foodcart: [...this.state.foodcart], CartPrize: TotalCartPrize
            })
        }else{
            let newfoodCartPrize =  this.state.CartPrize - this.state.foodcart.find(obj => obj.id == idToDelete).prize;
            let newfoodCart = this.state.foodcart.filter( e => e.id !== parseInt(idToDelete))

            this.setState({ tables: [ ...this.state.tables] ,foods: [ ...this.state.foods ], foodcart: [...newfoodCart], CartPrize: newfoodCartPrize })
        }
        let tableOrder = "tableOrder-"+document.getElementById("tableNumber").children[0].textContent
        if (localStorage.getItem(tableOrder) !== null) {
            localStorage.setItem(tableOrder, JSON.stringify(this.state.foodcart)); 
        }
    }

    refresh(){

        if(this.tableSelected == false){
            document.getElementById("table").children[1].innerHTML = TablesList(this.state.tables)
        }
        document.getElementById("menu").children[0].innerHTML = FoodList(this.state.foods)
        document.getElementById("details").children[2].innerHTML = FoodCartList(this.state.foodcart)
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
                     <div>${TablesList(this.state.tables)} </div>
                    
                </div>
            </div>
            <div class="span8">
                <div id="order">

                <h2>Select a table on left</h2>
                <div class="row">
                    <div class="span2">
                        <div id="menu">
                            
                        
                            ${FoodList(this.state.foods)}
                        
                                
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
                            
                            <div>
                            ${FoodCartList(this.state.foodcart)}    
                            </div>

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