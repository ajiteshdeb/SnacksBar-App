export function TablesList(tables){
    return `
    <ul class="allTables">
      ${tables.map(table => '<li onclick="app.selectTable(this,'+table.id+')"><div class="table-no">'+table.id+'</div><div class="table-name">'+table.name+'</div></li>').join('')}
      </ul>
    `
}