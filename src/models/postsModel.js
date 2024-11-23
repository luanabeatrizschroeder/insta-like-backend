import 'dotenv/config';
import conectarAoBanco from "../config/dbConfig.js" // Importa a função conectarAoBanco do arquivo "../config/dbConfig.js"
import { ObjectId } from 'mongodb';
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO); // Aguarda a conexão com o banco de dados usando uma string de conexão obtida de uma variável de ambiente

export async function getTodosPosts() { // Exporta uma função assíncrona chamada getTodosPosts
    const db = conexao.db("imersaoinstalikes") // Acessa o banco de dados "imersaoinstalikes" a partir da conexão estabelecida
    const colecao = db.collection("posts") // Obtém a coleção chamada "posts" dentro do banco de dados
    return colecao.find().toArray(); // Realiza uma consulta que retorna todos os documentos da coleção e os transforma em um array
};

export async function criarPost(novoPost) {
    const db = conexao.db("imersaoinstalikes") // Acessa o banco de dados "imersaoinstalikes" a partir da conexão estabelecida
    const colecao = db.collection("posts") // Obtém a coleção chamada "posts" dentro do banco de dados
    return colecao.insertOne(novoPost) // Insere o novoPost na coleção "posts" 
};

export async function atualizarPost(id, novoPost) {
    const db = conexao.db("imersaoinstalikes");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set: novoPost})
}