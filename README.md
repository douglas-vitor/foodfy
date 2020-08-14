# Foodfy

<div align="center">
<img src="https://github.com/douglas-vitor/LaunchBase_bootcamp/blob/master/logo-lauchbase.png" width="250px" height="auto">
</div>

###### Projeto sugerido em curso, para aperfeiçoamento de técnicas aprendidas em aulas. Desafio propos construir um site completo para uma empresa de receitas chamada Foodfy.

###### **Curso :** LaunchBase - [Rocketseat](https://rocketseat.com.br)
###### **Instrutor :** Mayk Brito

## **Instruções**

Para iniciar o servidor da aplicação use o comando **_npm start_** , caso a aplicação não abra automaticamente em seu navegador acesse **_http://localhost:3000/_**.

## **Rotas**

**[PÚBLICO]**
- /
- /about
- /recipes
- /recipes/{id}
- /chefs
- /search

**[ADMINISTRATIVO]**
- /admin
- /admin/recipes
- /admin/recipes/create
- /admin/recipes/{id}
- /admin/recipes/{id}/edit
- /admin/chefs
- /admin/chefs/create_chef
- /admin/chefs/{id}
- /admin/chefs/{id}/edit

## **Histórico**

1. Construir todo o HTML e CSS do site e deixa-lo funcionando com as especificações do desafio; 
2. Refatoramento de toda a estrutura do Foodfy, adicionado servidor próprio, pegando informações dinâmicamente, usando template engine Nunjucks, adicionado rota para pagina de erro 404, adicionado style responsivo à área pública;
3. Adicionado área administrativa ao site, para gestão de receitas(criação, edição e exclusão). Alterado arquivo base de dados, para arquivo data.json. Refatorado estrutura de arquivos, movido rotas para arquivos específicos.
4. Alterado armazenamento dos dados de arquivo JSON para banco de dados PostgreSQL; Criado novas páginas de (cadastro, listagem e edição) de chefs, agora as receitas podem ser atribuidas a um chef; Adicionado sistema de busca pelo nome das receitas; Adicionado paginação de receitas nas áreas pública e administrativa da aplicação; Adicionado verificação antes de excluir um chef, se o mesmo tiver receitas em seu nome, apresenta erro e não é excluido.