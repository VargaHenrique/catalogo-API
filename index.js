const express = require('express');
const fs = require('fs'); 
const dados = require('./data/dados.json');
const cors = require('cors'); 

const server = express();

//SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



server.use(cors());
server.use(express.json()); 


function salvarDados(){
    fs.writeFileSync(__dirname + '/data/dados.json', JSON.stringify(dados, null, 2));
}


server.get('/', (req, res) => {
    return res.json({mensagem: 'Nossa API está funcionando'});
});


server.listen(3000, () =>{
console.log("Servidor está funcionando!");
});





//GET - Buscar um ou mais recursos no servidor
server.get('/Imagens', (req, res) => {
    return res.json(dados.Imagens);
});

server.get('/Imagens/:id', (req, res) =>{
    const imagemId = parseInt(req.params.id);
    const imagem = dados.Imagens.find(imagem => imagem.id === imagemId);

    if (imagem) {
        return res.json(imagem);
    } else {
        return res.status(404).json({ error: 'Imagem não encontrada' });
    }
});




server.post("/Imagens", (req, res) =>{
    const novaImagem = req.body

    const id = Date.now().toString();

    if(!novaImagem.Imagens){
        return res.status(400).json({mensagem: "Dados incompletos"});
    }else{

        novaImagem.id = id; 

        dados.Imagens.push(novaImagem)
        
        salvarDados(dados)

        return res.status(201).json({mensagem: "Dados Completos"});
    }

});

//DELETE - Deletar um recurso no servidor
server.delete('/Imagens/:id', (req, res)=>{
    const id = parseInt(req.params.id); //pega o parametro da rota

    dados.Imagens = dados.Imagens.filter(u => u.id != id); //retorna todos os medicamentos que não tem o mesmo id do fil

    salvarDados(dados);

    return res.status(201).json({mensagem: "Instrumento excluido com sucesso"})
});


//PUT  - Atualizar um recurso no servidor

server.put('/Imagens/:id', (req, res) =>{
 
    const imagensId = parseInt(req.params.id); //pegar
    const atualizarImagens = req.body; //oque eu quero alterar

    const indiceImagens = dados.Imagens.findIndex(u => u.id === imagensId)

    if(indiceImagens === -1){
        return res.status(404).json({mensagem: "Imagem não encontrado"})
    }else{
        dados.Imagens[indiceImagens].id = atualizarImagens.id || dados.Imagens[indiceImagens].id

        dados.Imagens[indiceImagens].titulo = atualizarImagens.titulo || dados.Imagens[indiceImagens].titulo
        dados.Imagens[indiceImagens].url = atualizarImagens.url || dados.Imagens[indiceImagens].url
        dados.Imagens[indiceImagens].descricao = atualizarImagens.descricao || dados.Imagens[indiceImagens].descricao
        dados.Imagens[indiceImagens].serie = atualizarImagens.serie || dados.Imagens[indiceImagens].serie
        
        salvarDados(dados); 

        return res.status(201).json({mensagem: "Dados completos, atualização feita com sucesso"})
    }
});

