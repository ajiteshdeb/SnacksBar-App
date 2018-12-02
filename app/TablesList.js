export function TablesList(tables){
    return `
      ${console.log(tables),tables.map(table => '<li onclick="app.selectTable(this,'+table.id+')"><div class="table-no">'+table.id+'</div><div class="table-name">'+table.name+'</div></li>').join('')}
    
    `
}