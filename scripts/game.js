const mainBlock = document.querySelector('#mainBlock')
const randomLife = (availableLifes) => (Math.round(Math.random() * 10) > 5 ? true : false)
const layer = 20
const generateLives = (length) => {
  let availableLifes = 10
  const lifes = []
  let x = 1
  let y = 1


  const randomLife = () => {
    if (availableLifes > 0) {
      availableLifes--
      return true
    } else return false 
  }
  for (let i = 1; i < length + 1; i++) {
    lifes.push({
      alive: randomLife(availableLifes),
      number: i,
      x,
      y,
    })

    if (x % layer === 0) {
      y++
      x = 1
    } else {
      x++
    }
  }
  return lifes
}

let lifes = generateLives(layer * layer)

const renderLifes = (lifes, fontSize) => {
  lifes.map((l) => {
    const elem = document.createElement('div')
    elem.innerText = l.alive ? 'L': 'D'
    elem.setAttribute('class', `ceil ${l.alive ? 'alive': 'dead'}`)
    elem.style.position = 'absolute'
    elem.style.fontSize = fontSize + 'px'
    elem.style.left = l.x + 'em'
    elem.style.top = l.y + 'em'
    document.body.append(elem)
  })
}

renderLifes(lifes, 50)

const isExist = (x, y) => {
  let status = 'none'

  lifes.map((l) => {
    if (l.x === x && l.y === y)
      return (status = l.alive)
  })
  return status
}

const findOutParents = (lifes) => {
  const parents = lifes.map((l) => {
    const parents = []

    const leftUp = isExist(l.x - 1, l.y - 1)
    if (leftUp !== 'none') parents.push(leftUp)
    const up = isExist(l.x, l.y - 1)
    if (up !== 'none') parents.push(up)
    const rightUp = isExist(l.x + 1, l.y - 1)
    if (rightUp !== 'none') parents.push(rightUp)
    const left = isExist(l.x - 1, l.y)
    if (left !== 'none') parents.push(left)
    const right = isExist(l.x + 1, l.y)
    if (right !== 'none') parents.push(right)
    const leftDown = isExist(l.x - 1, l.y + 1)
    if (leftDown !== 'none') parents.push(leftDown)
    const down = isExist(l.x, l.y + 1)
    if (down !== 'none') parents.push(down)
    const rightDown = isExist(l.x + 1, l.y + 1)
    if (rightDown !== 'none') parents.push(rightDown)

    return {
      number: l.number,
      parents,
    }
  })

  return parents
}

const reviveMassive = (lifes, parents) => {
  const arrived = []
  lifes.map((l) => {
    if (!l.alive) {
      parents.map((p) => {
        if (l.number === p.number) {
          const aliveCeils = p.parents.filter((p) => p)
          if (aliveCeils.length === 3) arrived.push(l.number)
        }
      })
    }
  })
  return arrived
}

const killMassive = (lifes, parents) => {
  const killed = []
  lifes.map((l) => {
    if (l.alive) {
      parents.map((p) => {
        if (l.number === p.number) {
          const aliveCeils = p.parents.filter((p) => p)
          if (aliveCeils.length < 2 || aliveCeils.length > 4) {
            killed.push(l.number)
          }
        }
      })
    }
  })
  return killed
}

const deleteLayerCeils = () => {
  const ceils = document.querySelectorAll('.ceil')
  ceils.forEach(v => {
    v.remove()
  })
}

// + Мертвая клетка может стать живой если рядом с ней находится ровно 3 живые клетки
// Умрет если живых соседей меньше 2 и больше 4
const nextStage = () => {
  console.log('next stage')
  const parents = findOutParents(lifes)
  const arived = reviveMassive(lifes, parents)
  const killed = killMassive(lifes, parents)
  const newLifes = lifes.map((l) => {
    if (arived.includes(l.number)) {
      return {
        ...l,
        alive: true,
      }
    }

    if (killed.includes(l.number)) {
      return {
        ...l,
        alive: false,
      }
    }

    return l
  })
  lifes = newLifes
  deleteLayerCeils()
  renderLifes(lifes, 50)
}

const nextStageTrigger = () => {
  setInterval(nextStage, 500)
}
