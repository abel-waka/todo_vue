# BACK END
> Está realizado en **FIREBASE** 
Link: https://console.firebase.google.com/project/tasks-bab33

```js
const task: {
    id,
    text: String,
    isDone: Boolean,
    priority: Number
}
``` 

---
# TO DO
- [ ] Boton to más grande
- [ ] input más destacable borde, boton, icono boton
- [ ] Modal overlay más oscura + botones más grandes + fuente

---
# DEPLOY
1. Eliminar rama gh-pages en github
2. npm run build
3. git add dist -f
4. git commit -m [your commit message here]
5. git subtree push --prefix dist origin gh-pages