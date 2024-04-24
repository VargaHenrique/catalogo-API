let imagensArrayLength = 0;

const imageContainer = document.getElementById('image-container')
const cadastroForm = document.getElementById('cadastrar-form')


let currentImageTitulo = "";
let currentImageDescricao = "";
let currentImageSerie = "";



function listImagens() {
  fetch('http://127.0.0.1:3000/Imagens')
    .then(response => response.json())
    .then(data => {
      imagensArrayLength = data.length;
      const gallery = document.getElementById('gallery');
      data.forEach(imagem => {
        const img = document.createElement('img');
        img.src = imagem.url;
        img.alt = `${imagem.id} - ${imagem.titulo} - ${imagem.descricao} (${imagem.serie})`


        img.addEventListener('click', function () {
          exibirImagem(imagem.id);
        });

        gallery.appendChild(img);
      });
    })
    .catch(error => console.error('Erro ao obter dados das imagens:', error));
}


function exibirImagem(id) {
  fetch(`http://127.0.0.1:3000/Imagens/${id}`)
    .then(response => response.json())
    .then((data) => {

      const overlay = document.getElementById('overlay');
      overlay.innerHTML = 
                `<div class="image-container">
                <img src="${data.url}" height= 500>
               <button class="close-btn" onclick="fecharOverlay()">Voltar</button>
                <div class="options">
                  <button onclick="alterar(${data.id})">Alterar</button>
                  <button onclick="description()">Descrição</button>
                </div>
              </div>`
      overlay.style.display = 'flex';




      currentImageTitulo = data.titulo;
      currentImageDescricao = data.descricao;
      currentImageSerie = data.serie;



      // Remova o botão 
      const existingDeleteButton = document.getElementById('delete-button');
      if (existingDeleteButton) {
        existingDeleteButton.remove();
      }


      const deleteButton = document.createElement('button');
      deleteButton.id = 'delete-button';
      deleteButton.innerText = 'Deletar';
      deleteButton.style.backgroundColor = 'red';
      deleteButton.style.color = 'white';
      deleteButton.style.border = 'none';
      deleteButton.style.padding = '10px 20px';
      deleteButton.style.borderRadius = '5px';
      deleteButton.style.cursor = 'pointer';
      deleteButton.style.position = 'absolute';

      deleteButton.style.top = '60%';
      deleteButton.style.left = '65%';
      deleteButton.addEventListener('click', () => deletar(id));
      overlay.appendChild(deleteButton);

    })
    .catch(error => console.error('Erro ao exibir imagem:', error));
}



function fecharOverlay() {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'none';
}

function description() {
  alert("Título: " + currentImageTitulo + "\n\nDescrição do instrumento: " + currentImageDescricao + "\n\nSérie: " + currentImageSerie);
}




//VER EM CASA 
function alterar(id) {
  // Lógica para alterar imagem
  const newTitulo = prompt("Novo titulo:");
  const newDescricao = prompt("Novo descrição:");
  const newSerie = prompt("Novo serie:");


  if (newTitulo && newDescricao && newSerie) {
    fetch(`http://localhost:3000/Imagens/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({titulo: newTitulo, descricao: newDescricao, serie: newSerie }),

    })
      .then(() => listImagens())
      .catch(error => console.error('Erro:', error));
  } else {
    console.error('Por favor, forneça todos os campos necessários.');
  }
}

//FUNCIONAAAAAAAAAAA GLÓÓÓRIAA
function deletar(id) {
  fetch(`http://localhost:3000/Imagens/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao deletar imagem');
      }
      alert('Imagem deletada com sucesso!');
      listImagens();
    })
    .catch(error => console.error('Erro:', error));
}



/*cadastroForm.addEventListener('submit', (e) => {

  e.preventDefault(); //PREVENÇÃO PADRÃO DE ERRO
  fetch('http://localhost:3000/Imagens')
      .then(response => response.json())
      .then(data => {
          let id = imagensArrayLength + 1
  
          data.forEach(imagem => {
              if (imagem.id == id) {
                  id++;
              }
          });
  
     ///////////////////////////////////MEDICAMENTO///////////////////////////////////
  
     const titulo = document.getElementById('titulo').value;
     const descricao = document.getElementById('descricao').value;
     const serie = document.getElementById('serie').value;
     
  
  
  fetch('http://localhost:3000/Imagens', {
     method:  'POST', 
     headers: { //A FORMa COMO VAI BUSCAR OS DADOS
      'Content-Type': 'application/json'
  },
  
  
  //TRANSFORMA EM UM TEXTO QUE PODE SER LIDO PELO SERVIDOR
    body: JSON.stringify({titulo: titulo, descricao: descricao, serie: serie, quantidade: quantidade}) 
  
  })
  
  //RECEBE A RESPONSABILIDADE DA REQUISIÇÃO E TRANSFORMA EM UM  JSOM
  .then(response => response.json()) 
  .then(() => {
      listImagens()
      cadastroForm.reset()
  })
  .catch(error => console.error('Erro:' + error))
  
  }); 
  });*/




listImagens()