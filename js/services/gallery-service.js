let gKeywords = []
let filteredImgs = []

const gKeywordsMap = {
  sports: 30,
  animals: 22,
  surprise: 31,
  politics: 28,
  funny: 30,
}

var gImgs = [
  { id: 1, url: 'img/meme-imgs/1.jpg', keywords: ['politics'] },
  { id: 2, url: 'img/meme-imgs/2.jpg', keywords: ['animals', 'love'] },
  { id: 3, url: 'img/meme-imgs/3.jpg', keywords: ['animals', 'sleep'] },
  { id: 4, url: 'img/meme-imgs/4.jpg', keywords: ['animals', 'sleep'] },
  { id: 5, url: 'img/meme-imgs/5.jpg', keywords: ['success', 'baby'] },
  { id: 6, url: 'img/meme-imgs/6.jpg', keywords: ['happy'] },
  { id: 7, url: 'img/meme-imgs/7.jpg', keywords: ['surprise', 'baby'] },
  { id: 8, url: 'img/meme-imgs/8.jpg', keywords: ['funny'] },
  { id: 9, url: 'img/meme-imgs/9.jpg', keywords: ['evil'] },
  { id: 10, url: 'img/meme-imgs/10.jpg', keywords: ['politics'] },
  { id: 11, url: 'img/meme-imgs/11.jpg', keywords: ['sports'] },
  { id: 12, url: 'img/meme-imgs/12.jpg', keywords: ['tv-show'] },
  { id: 13, url: 'img/meme-imgs/13.jpg', keywords: ['surprise'] },
  { id: 14, url: 'img/meme-imgs/14.jpg', keywords: ['surprise'] },
  { id: 15, url: 'img/meme-imgs/15.jpg', keywords: ['surprise'] },
  { id: 16, url: 'img/meme-imgs/16.jpg', keywords: ['surprise', 'funny'] },
  { id: 17, url: 'img/meme-imgs/17.jpg', keywords: ['politics'] },
  { id: 18, url: 'img/meme-imgs/18.jpg', keywords: ['surprise'] },
  { id: 19, url: 'img/meme-imgs/19.jpg', keywords: ['funny', 'evil'] },
  { id: 20, url: 'img/meme-imgs/20.jpg', keywords: ['funny'] },
  { id: 21, url: 'img/meme-imgs/21.jpg', keywords: ['lonely'] },
  { id: 22, url: 'img/meme-imgs/22.jpg', keywords: ['sports'] },
  { id: 23, url: 'img/meme-imgs/23.jpg', keywords: ['sports'] },
  { id: 24, url: 'img/meme-imgs/24.jpg', keywords: ['sports'] },
]

setKeyWords()

function getAllImages() {
  return (strHtmls = gImgs.map((img) => {
    return ` <img onclick="onSelectedMeme(this)"  class="meme" 
        data-id=${img.id} src=${img.url} data-title= ${img.keywords}>`
  }))
}

function setCommonKeyWords(keyword) {
  if (gKeywordsMap[keyword] > 60) return
  if (!gKeywordsMap[keyword]) {
    gKeywordsMap[keyword] = 16
    return
  }
  gKeywordsMap[keyword] += 5
}

function getKeyWordsFrequency(keyword) {
  return gKeywordsMap[keyword]
}

function getSavedMemes(memes) {
  var strHtmls = memes.map((meme) => {
    return `<img src=${meme}>`
  })
  return strHtmls.join('')
}

function getImgById(imgId) {
  return gImgs.find((image) => image.id === imgId)
}

function setKeyWords() {
  gImgs.forEach((img) => {
    img.keywords.forEach((keyword) => {
      if (!gKeywords.includes(keyword)) {
        gKeywords.push(keyword)
      }
    })
  })
}

function getSearchKeyWords() {
  return gKeywords.map((keyword) => {
    return `<option value="${keyword}">`
  })
}

function getKeyWords() {
  return gKeywords.map((keyword) => {
    var size = gKeywordsMap[keyword] ? gKeywordsMap[keyword] : 16
    return `<label onclick="onSearchImgs('${keyword}')"
         style="font-size:${size}px">${keyword}</label>`
  })
}

function getSearchImgs(searchKey) {
  return gImgs.filter(function (img) {
    return img.keywords.includes(searchKey)
  })
}

function getImgsForDisplay(images) {
  return (strHtmls = images.map((img) => {
    return ` <img onclick="onSelectedMeme(this)"  class="meme" 
        data-id=${img.id} src=${img.url} data-title= ${img.keywords}>`
  }))
}

function addImg(url, keyword = 'none') {
  var image = { id: 99, url, keyword }
  gImgs.push(image)
}

function getImages() {
  return gImgs
}
