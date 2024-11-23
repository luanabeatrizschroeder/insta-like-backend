import { getTodosPosts , criarPost, atualizarPost } from "../models/postsModel.js"; // Importa a função getTodosPosts do arquivo "../models/postsModel.js", essa função é responsável por buscar todos os posts no banco de dados
import fs from 'fs'; // Importa o módulo `fs` (File System), usado para manipular arquivos no sistema de arquivos, aqui será usado para renomear ou mover arquivos carregados
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts(req, res) { // Exporta uma função assíncrona chamada listarPosts
        const posts = await getTodosPosts() // Chama a função getTodosPosts para obter todos os posts do banco de dados
        res.status(200).json(posts); // Define o status da resposta HTTP como 200 (sucesso) e envia os posts no formato JSON
    };

export async function postarNovoPost(req, res) { // Exporta uma função assíncrona chamada `postarNovoPost`, usada como controlador para criar novos posts
    const novoPost = req.body; // Recupera os dados enviados pelo cliente no corpo da requisição (`req.body`) e os armazena na constante `novoPost`
    try {
        const postCriado = await criarPost(novoPost) // Aguarda a execução da função `criarPost`, que insere o novo post no banco de dados e retorna o resultado da operação
        res.status(200).json(postCriado);
    } catch(erro) {
        console.error(erro.message) // Exibe no console a mensagem de erro, caso a operação de criação falhe
        res.status(500).json({"Erro": "Falha na requisição"})
    }
};

export async function uploadImagem(req, res) { // Exporta uma função assíncrona chamada `uploadImagem`, usada como controlador para lidar com upload de imagens e criação de posts associados
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname, // Usa o nome original do arquivo enviado (`req.file.originalname`) para definir o campo `imgUrl`.
        alt: ""
    };
    try {
        const postCriado = await criarPost(novoPost) // Cria o novo post no banco de dados e aguarda o resultado.
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png` // Define o novo caminho/nome do arquivo, usando o ID do post recém-criado (`postCriado.insertedId`) como nome do arquivo.
        fs.renameSync(req.file.path, imagemAtualizada) // Usa o método `fs.renameSync` para renomear/mover o arquivo de `req.file.path` para o novo caminho definido em `imagemAtualizada`
        res.status(200).json(postCriado);
    } catch(erro) {
        console.error(erro.message)
        res.status(500).json({"Erro": "Falha na requisição"})
    }
};

export async function atualizarNovoPost(req, res) {
    const id = req.params.id; 
    const urlImagem = `http://localhost:3000/${id}.png`;
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        };
        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.error(erro.message)
        res.status(500).json({"Erro": "Falha na requisição"})
    }
};



/* RESUMO DAS FUNÇÕES
listarPosts: Retorna todos os posts do banco de dados
postarNovoPost: Cria um novo post com os dados recebidos no corpo da requisição
uploadImagem: Salva uma imagem enviada, associa a imagem a um post no banco de dados e renomeia o arquivo com base no ID do post */


