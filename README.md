# Backend do Projeto iComida

## Criando o projeto
Criando o Backend
=================
cd projetos
mkdir backicomida
cd backicomida
npm init (ENTER para o default)
npm i express  (web server)
npm i mongoose@5.11.15 (conexão com MongoDB)
sudo npm i -g nodemon (Hot Reload)
npm i dotenv (Variáveis de Ambiente)	
code .

Terminal/New Terminal
git init
git add .
git commit -m "Projeto Inicial"
node ou nodemon index.js
## Mensagem de Erro: Nodemon: Error: listen EADDRINUSE: address already in use
```
$ lsof -i tcp:4000
$ kill -9 PID
``` 