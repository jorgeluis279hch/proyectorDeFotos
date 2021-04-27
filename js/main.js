let range = document.querySelector('#range'),
  reflect = document.querySelector('#numero'),
  dragAreq = document.querySelector('.filesDrag'),
  iconMenu = document.querySelector('.icon-menu'),
  colorFilter = document.querySelector('.colores');

const toggle = (element, toggleStr) => element.classList.toggle(toggleStr);

let paths = [];

dragAreq.addEventListener("drop", dropHandler);
dragAreq.addEventListener("dragover", dragOver);
iconMenu.addEventListener('click', menuActivate);
range.addEventListener("change", () => {
  reflect.textContent = range.value;

});

colorFilter.addEventListener('click', e => {
    let elem = e.target.nextElementSibling;
    toggle(elem, 'filters__hidden');
  }
);

function menuActivate(e) {
  let menu = document.querySelector('.nav__showMenu');
  toggle(menu, 'hidden');
  // menu.style.animationName = 'jump';
} 

function removeDragData(e) {
  let data = e.dataTransfer.items;
  if (data){
    data.clear();
  } else {
    e.dataTransfer.clearData();
  }
}

function dragOver(e) {
  document.querySelector('.filesDrag__text').textContent = 'Archivos añadidos puedes agregar mas';
  e.preventDefault();
}

function handleFileSelect(archivos) {
  // let files = evt.target.files; // objeto Filelist
  let files = archivos;
  
  // bucle del filelist y obtiene un thumb
  for (let i = 0, f; f = files[i]; i++) {

    //procesa las imagenes
    if (!f.type.match('image.*')) {
      // continue;
      console.log(f);
    }

    let reader = new FileReader();

    // Closure to capture the file information. 
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        let span = document.createElement('span');
        span.innerHTML = ['<img class="thumb" src="', e.target.result,
                          '" title="', escape(theFile.name), '"/>'].join('');
        paths.push(e.target.result);
        document.getElementById('list').insertBefore(span, null);
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }
}

function dropHandler(e) {
  e.preventDefault();
  let data = e.dataTransfer;
  let len = data.items.length;

  if (data.files){
    handleFileSelect(data.files);
    createElem(data.files);
    // for (let i = 0; i < data.files.length; i++){
    //   console.log(data.files[i]);
    // }
  } else {
    for (let i = 0; e < len; i++){
      if (e.dataTransfer.items[i].kind === 'file'){
        let file = data.items[i].getAsFile();
        console.log(file.name);
      }
    }
  }
  // document.querySelector('.filesDrag__text').textContent = 'Ficheros cargados';
  removeDragData(e);
}

document.getElementById('import-btn').addEventListener('change', handleFileSelect, false);

// preview 
const createElem = (imgs, output) => { 

  let fragment = document.createDocumentFragment();

  for (let i = 0; i < imgs.length; i++){
    let div = document.createElement('div');
    div.innerHTML = `<span class="icon-previous"></span>
                    <img src="${paths[i]}" alt="img presentation" srcset="">
                    <span class="icon-next"></span>`;
    div.className = 'img__presentation';
    fragment.appendChild(div);
  }

  let out = output || '.preview__presentation';
  document.querySelector(out).appendChild(fragment);
}

document.querySelector('#btn-start').addEventListener('click', () => {
  document.querySelector('.preview__image').style.display = 'none';
  let t = document.getElementById('range').value;
  changeSlide(t);
});

const changeSlide = (time) => {
  let imgs = document.querySelectorAll('.img__presentation');
  let cantidadImgs = imgs.length;
  let i = 0;

  setInterval(() => {
    for (; i <= cantidadImgs;i = (i + 1) % cantidadImgs){
      if (imgs[i].classList.contains('start')) {
        imgs[i].classList.remove('start');
        imgs[i].nextElementSibling.classList.add('start');
      } else {
        imgs[0].classList.add('start');
      }
    }
  }, (time * 1000));
}



(function () {
  reflect.textContent = range.value;
}())

