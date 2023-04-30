'use strict'
function onInit() {
  renderGallery()
  setSearchOptions()
  showKeyWords()
  stickersScroll()
}

function refreshPage() {
  location.reload()
}

function renderGallery() {
  const imgs = getAllImages()
  document.querySelector('.gallery').innerHTML = imgs.join('')
}

function onSelectedMeme(element) {
  document.querySelector('.main-gallery').classList.add('not-display')
  document.querySelector('.editor').classList.remove('not-display')
  initCanvas()
  let id = +element.getAttribute('data-id')
  let meme = createMeme(id)
  setMeme(meme)
  drawImg()
}

function showGallery() {
  document.querySelector('.main-gallery').classList.remove('not-display')
  document.querySelector('.editor').classList.add('not-display')
}

function onImgInput(ev) {
  document.querySelector('.main-gallery').classList.add('not-display')
  document.querySelector('.editor').classList.remove('not-display')
  loadImageFromInput(ev, renderImg)
}

function renderImg(img) {
  addImg(img.src)
  initCanvas()
  let meme = createMeme(99)
  setMeme(meme)
  drawImg(img)
}

function onShowSavedMemes() {
  document.querySelector('.main-gallery').classList.remove('not-display')
  document.querySelector('.editor').classList.add('not-display')
  closeMenu()

  let memes = loadFromStorage(KEY_MEMES)
  if (!memes) {
    document.querySelector('.gallery').innerHTML = '<h1>No MEMES Yet </h1>'
    return
  }
  let imgs = getSavedMemes(memes)
  document.querySelector('.gallery').innerHTML = imgs
}

function onSearchImgs(keyword) {
  if (!keyword) {
    renderGallery()
    return
  }
  setCommonKeyWords(keyword)
  showKeyWords()
  let filteredImgs = getSearchImgs(keyword)
  let imgs = getImgsForDisplay(filteredImgs)
  document.querySelector('.gallery').innerHTML = imgs.join('')
}

function setSearchOptions() {
  let keywords = getSearchKeyWords()
  document.getElementById('search').innerHTML = keywords.join('')
}

function showKeyWords() {
  let numOfWords = 5
  let keywords = getKeyWords()
  keywords = keywords.splice(0, numOfWords)
  let htmls =
    keywords.join('') + `<label onclick="showAllkeyWords()">more..</label>`
  document.querySelector('.key-words').innerHTML = htmls
}

function showAllkeyWords() {
  let keywords = getKeyWords()
  let elWords = document.querySelector('.key-words')
  let elClose = `<label onclick="showKeyWords()"><i class="fas fa-arrows-alt-v"></i></label>`
  elWords.innerHTML = keywords.join('') + elClose
  elWords.classList.remove('not-display')
}

function closeMenu() {
  document.body.classList.remove('menu-open')
  document.querySelector('.btn-menu-toggle').innerText = '☰'
}

function toggleMenu() {
  const isMenuOpen = document.body.classList.contains('menu-open')
  if (isMenuOpen) {
    closeMenu()
  } else {
    document.body.classList.add('menu-open')
    document.querySelector('.btn-menu-toggle').innerText = 'X'
    const liElements = document.querySelectorAll('.menu li')
    if (liElements.innerText === 'Memes') {
      closeMenu()
    }
  }
}

function stickersScroll() {
  const stickersContainer = document.querySelector('.stickers-container')
  const stickers = stickersContainer.querySelector('.stickers')
  const leftArrow = stickersContainer.querySelector('.arrow.left')
  const rightArrow = stickersContainer.querySelector('.arrow.right')

  leftArrow.addEventListener('click', () => {
    stickers.scrollBy(-50, 0)
  })

  rightArrow.addEventListener('click', () => {
    stickers.scrollBy(50, 0)
  })
}
