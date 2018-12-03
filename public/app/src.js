import { App } from './app.js'

async function view(Component, element){
  let app = new Component(element)
  app.render()
  await app.componentDidMount()
  window.app = app
}

view(App, 'root')