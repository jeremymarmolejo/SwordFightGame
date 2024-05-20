const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width=1024
canvas.height = 576//size

c.fillRect(0,0,canvas.width,canvas.height)//background

const gravity = 0.7

const background = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    imageSrc: './img/Art.png'
})
const shop = new Sprite({
    position:{
        x: 360,
        y: 190,
    },
    imageSrc: './img/shop.png',
    scale:2.75,
    framesMax: 6
})
const player = new Fighter({
    position: {
      x:300,
      y: 0
    },
    velocity: {
      x: 0,
      y: 0
    },
    offset: {
      x: 0,
      y: 0
    },
    imageSrc: './img/Hero/Idle.png',
    framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 100
  },
  sprites: {
    idle: {
            imageSrc:'./img/Hero/Idle.png',
            framesMax: 8
        },
        run:{
            imageSrc:'./img/Hero/Run.png',
            framesMax: 8
        },
        jump:{
            imageSrc:'./img/Hero/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc:'./img/Hero/Fall.png',
            framesMax: 2
        },
        attack:{
            imageSrc:'./img/Hero/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/Hero/Take hit.png',
            framesMax: 4
          },
          death: {
            imageSrc: './img/Hero/Death.png',
            framesMax: 6
          },
    },
    attackBox: {
        offset: {
          x: 130,
          y: 50
        },
        width: 170,
        height: 50
      }
    })
    

const enemy = new Fighter({
	position: {
        x: 760,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      },
      color: 'blue',
      offset: {
        x: -50,
        y: 0
      },
    imageSrc: './img/Knight/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
    x: 215,
    y: 0
    },
    sprites:{
        idle:{
            imageSrc:'./img/Knight/Idle.png',
            framesMax: 11
        },
        run:{
            imageSrc:'./img/Knight/Run.png',
            framesMax: 8
        },
        jump:{
            imageSrc:'./img/Knight/Jump.png',
            framesMax: 4
        },
        fall:{
            imageSrc:'./img/Knight/Fall.png',
            framesMax: 4
        },
        attack:{
            imageSrc:'./img/Knight/Attack.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/Knight/Take hit.png',
            framesMax: 4
          },
        death: {
            imageSrc: './img/Knight/Death.png',
            framesMax: 9
          },
    },
    attackBox: {
        offset: {
          x: -200,
          y: 50
        },
        width: 160,
        height: 50
      }
    })
  console.log(player)
  
  const keys = {
    a: {
      pressed: false
    },
    d: {
      pressed: false
    },
    l: {
      pressed: false
    },
    j: {
      pressed: false
    }
  }
  
  decreaseTimer()
  
  function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
  
    player.velocity.x = 0
    enemy.velocity.x = 0
  
    // player movement
  
    if (keys.a.pressed && player.lastKey === 'a') {
      player.velocity.x = -8
      player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
      player.velocity.x = 8
      player.switchSprite('run')
    } else {
      player.switchSprite('idle')
    }
  
    // jumping
    if (player.velocity.y < 0) {
      player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
      player.switchSprite('fall')
    }
  
    // Enemy movement
    if (keys.j.pressed && enemy.lastKey === 'j') {
      enemy.velocity.x = -10
      enemy.switchSprite('run')
    } else if (keys.l.pressed && enemy.lastKey === 'l') {
      enemy.velocity.x = 15
      enemy.switchSprite('run')
    } else {
      enemy.switchSprite('idle')
    }
  
    // jumping
    if (enemy.velocity.y < 0) {
      enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
      enemy.switchSprite('fall')
    }
  
    // detect for collision & enemy gets hit
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
      }) &&
      player.isAttacking &&
      player.framesCurrent === 4
    ) {
      enemy.takeHit()
      player.isAttacking = false
  
      gsap.to('#enemyHealth', {
        width: enemy.health + '%'
      })
    }
  
    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
      player.isAttacking = false
    }
  
    // this is where our player gets hit
    if (
      rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
      }) &&
      enemy.isAttacking &&
      enemy.framesCurrent === 2
    ) {
      player.takeHit()
      enemy.isAttacking = false
  
      gsap.to('#playerHealth', {
        width: player.health + '%'
      })
    }
  
    // if player misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
      enemy.isAttacking = false
    }
  
    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
      determineWinner({ player, enemy, timerId })
    }
  }
  
  animate()
  
  window.addEventListener('keydown', (event) => {
    if (!player.dead) {
      switch (event.key) {
        case 'd':
          keys.d.pressed = true
          player.lastKey = 'd'
          break
        case 'a':
          keys.a.pressed = true
          player.lastKey = 'a'
          break
        case 'w':
          player.velocity.y = -20
          break
        case 's':
          player.attack()
          break
      }
    }
  
    if (!enemy.dead) {
      switch (event.key) {
        case 'l':
          keys.l.pressed = true
          enemy.lastKey = 'l'
          break
        case 'j':
          keys.j.pressed = true
          enemy.lastKey = 'j'
          break
        case 'i':
          enemy.velocity.y = -15
          break
        case 'k':
          enemy.attack()
  
          break
      }
    }
  })
  
  window.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'd':
        keys.d.pressed = false
        break
      case 'a':
        keys.a.pressed = false
        break
    }
  
    // enemy keys
    switch (event.key) {
      case 'l':
        keys.l.pressed = false
        break
      case 'j':
        keys.j.pressed = false
        break
    }
  })