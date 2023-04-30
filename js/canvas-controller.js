'use strict'
let gSavedMemes = []
let KEY_MEMES = 'memes'
let gCanvas
let gCtx
let gDrag = false
let gStartPos
let animationFrameId
let startX, startY
let prevX, prevY
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function initCanvas() {
  document.querySelector('.input-text').value = ''
  gCanvas = document.getElementById('canvas')
  gCtx = gCanvas.getContext('2d')
  addMouseListener()
  addTouchListeners()
  if (window.innerWidth <= 550) {
    gCanvas.width = gCanvas.height = 280
  }
}

function addMouseListener() {
  gCanvas.addEventListener('mousedown', startDrag)
  gCanvas.addEventListener('mousemove', onDrag)
  gCanvas.addEventListener('mouseup', finishDrag)
}

function addTouchListeners() {
  gCanvas.addEventListener('touchstart', startDrag)
  gCanvas.addEventListener('touchmove', onDrag)
  gCanvas.addEventListener('touchend', finishDrag)
}

function startDrag(ev) {
  const meme = getMeme()
  gStartPos = getEvPos(ev)
  const clickedLine = meme.lines.find((line) => {
    return (
      gStartPos.y <= line.y + line.size &&
      gStartPos.y >= line.y - line.size &&
      gStartPos.x <= line.x + line.widthTxt &&
      gStartPos.x > line.x - line.widthTxt
    )
  })

  if (!clickedLine) return
  setCurrLineIdx(clickedLine.id)
  markLine()
  gDrag = true
  gCanvas.style.cursor = 'move'
  startX = ev.clientX
  startY = ev.clientY
  prevX = startX
  prevY = startY
  animationFrameId = requestAnimationFrame(onDrag)
}

function onDrag(ev) {
  if (!gDrag) return
  const currX = ev.clientX
  const currY = ev.clientY
  const dx = currX - prevX
  const dy = currY - prevY
  const posDiff = Math.sqrt(dx * dx + dy * dy)
  if (posDiff) {
    const currLine = getCurrentLine()
    currLine.x += dx
    currLine.y += dy
    prevX = currX
    prevY = currY
    drawImg()
  }
  animationFrameId = requestAnimationFrame(onDrag)
}

function getEvPos(ev) {
  let pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  }
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault()
    ev = ev.changedTouches[0]
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    }
  }
  return pos
}

function finishDrag(ev) {
  if (!gDrag) return
  cancelAnimationFrame(animationFrameId)
  drawImg()
  markLine()
  gDrag = false
  gCanvas.style.cursor = ''
}

function drawImg() {
  let img = new Image()
  let meme = getMeme()
  let memeId = meme.selectedImgId
  let memeImg = getImgById(memeId)
  img.src = memeImg.url
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    drawText()
  }
}

function renderImg(img) {
  gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
}

function onAddLine() {
  document.querySelector('.input-text').value = ''
  addLine()
}

function onSave() {
  const currMeme = gCanvas.toDataURL('image/jpeg')
  let memes = loadFromStorage(KEY_MEMES)
  if (!memes || memes === null) {
    let memes = [currMeme]
    saveToStorage(KEY_MEMES, memes)
    return
  }
  memes.push(currMeme)
  saveToStorage(KEY_MEMES, memes)
}

function onCreateSticker(sticker) {
  setNewLine(sticker, 'txt')
  drawImg()
}

function onWriteText(ev) {
  setNewLine(ev.value, 'txt')
  drawImg()
}

function onChangeFont(value) {
  setNewLine(value, 'font')
  drawImg()
}

function onColorClicked() {
  document.querySelector('.color-btn').classList.add('not-display')
  document.querySelector('.color-fill').classList.remove('not-display')
}

function onChangeColor(color) {
  document.querySelector('.color-btn').classList.remove('not-display')
  document.querySelector('.color-fill').classList.add('not-display')
  setNewLine(color, 'color')
  drawImg()
}

function onBorderClicked() {
  document.querySelector('.border-btn').classList.add('not-display')
  document.querySelector('.border-fill').classList.remove('not-display')
}

function onChangeBorder(color) {
  document.querySelector('.border-btn').classList.remove('not-display')
  document.querySelector('.border-fill').classList.add('not-display')
  setNewLine(color, 'borderColor')
  drawImg()
}

function onDownload(elLink) {
  const data = gCanvas.toDataURL()
  elLink.href = data
}

function openModal() {
  let aside = document.querySelector('aside.modal')
  aside.style.display = 'block'
}

function closeModal() {
  let aside = document.querySelector('aside.modal')
  aside.style.display = 'none'
}

function onUpload(platform) {
  console.log('Uploading to ' + platform)
  closeModal()
}

function onChangeSize(value) {
  let currLineIdx = getMeme().selectedLineIdx
  let diff = +value + getMeme().lines[currLineIdx]['size']
  setNewLine(diff, 'size')
  drawImg()
}

function onMoveUp() {
  let currLine = getCurrentLine()
  currLine['y'] -= 5
  drawImg()
}

function onMoveDown() {
  let currLine = getCurrentLine()
  currLine['y'] += 5
  drawImg()
}

function onAlignCenter() {
  let currLine = getCurrentLine()
  let txtSize = gCtx.measureText(currLine.txt).width
  currLine['x'] = gCanvas.width / 2 - txtSize / 2
  drawImg()
}

function onAlignLeft() {
  let currLine = getCurrentLine()
  currLine['x'] = 0
  drawImg()
}

function onAlignRight() {
  let currLine = getCurrentLine()
  let txtSize = gCtx.measureText(currLine.txt).width
  currLine['x'] = gCanvas.width - txtSize
  drawImg()
}

function onDeleteLine() {
  deleteLine()
  drawImg()
}

function markLine() {
  const meme = getMeme()
  const currLineIdx = getCurrentLine().id
  let width = meme.lines[currLineIdx].widthTxt
  let height = meme.lines[currLineIdx].size * 1.2
  let posX = meme.lines[currLineIdx].x
  let posY = meme.lines[currLineIdx].y - height * 0.9
  gCtx.beginPath()
  gCtx.rect(posX, posY, width, height)
  gCtx.strokeStyle = 'black'
  gCtx.fillStyle = 'rgb(0, 0, 0, 0.1)'
  gCtx.lineWidth = '2'
  gCtx.strokeRect(posX, posY, width, height)
  gCtx.fillRect(posX, posY, width, height)
}

function drawText() {
  const meme = getMeme()
  meme.lines.forEach((line) => {
    const myText = line.txt
    let mySize = line.size
    let myAlign = line.align
    let myColor = line.color
    let myColorLine = line.borderColor
    let yPos = line.y
    let xPos = line.x
    let width = line.width
    let height = line.height
    let font = line.font

    gCtx.lineWidth = 1
    gCtx.strokeStyle = myColorLine
    gCtx.fillStyle = myColor
    gCtx.font = `${mySize}px ${font}`
    gCtx.textAlign = myAlign
    gCtx.fillText(myText, xPos, yPos)
    setWidthTxt(line.id, gCtx.measureText(myText).width)
    gCtx.strokeText(myText, xPos, yPos)
  })
}

function loadImageFromInput(ev, onImageReady) {
  let reader = new FileReader()

  reader.onload = function (event) {
    let img = new Image()
    img.onload = onImageReady.bind(null, img)
    img.src = event.target.result
  }
  reader.readAsDataURL(ev.target.files[0])
}
