import express from "express"; // Importa o módulo Express, uma biblioteca para criar servidores web em Node.js
import multer from "multer";
import cors from "cors";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js"; // Importa a função listarPosts do arquivo "../controllers/postsController.js"

const corsOptions = {
    origin: "http://localhost:8000", 
    optionsSuccessStatus: 200
};

const storage = multer.diskStorage({ // Configura o armazenamento personalizado para o multer
    destination: function(req, file, cb){
        cb(null, 'uploads/'); // Define o destino dos arquivos enviados, aqui todos os arquivos serão armazenados na pasta "uploads/"
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);  // Define o nome do arquivo enviado, aqui o nome original do arquivo é mantido (`file.originalname`)
    }
})

const upload = multer({dest: "./uploads" , storage}) // Cria uma instância do `multer` com as configurações especificadas. O destino padrão é "./uploads", mas o armazenamento foi personalizado com a configuração acima para absorver a demanda do Windows, sendo Linux/Mac não precisaria de todas essas configurações, seria apenas:
// const upload = multer({dest: "./uploads"}) 

const routes = (app) => {  // Define uma função chamada `routes`, que recebe como parâmetro o `app` do Express
    app.use(express.json()); // Configura o aplicativo para usar middleware que transforma o corpo das requisições em JSON, assim o servidor pode interpretar requisições JSON
    app.use(cors(corsOptions))
    app.get("/posts", listarPosts); // Rota para buscar todos os posts
    app.post("/posts", postarNovoPost); // Rota para criar um post
    app.post("/upload", upload.single("imagem"), uploadImagem); // Rota para fazer upload de imagens
    app.put("/upload/:id", atualizarNovoPost)
};

export default routes; // Exporta a função routes como padrão para ser usada em outros arquivos