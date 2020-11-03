# Foodfy

<div align="center">
<img src="https://github.com/douglas-vitor/LaunchBase_bootcamp/blob/master/logo-lauchbase.png" width="250px" height="auto">
</div>

###### Projeto sugerido em curso, para aperfeiçoamento de técnicas aprendidas em aulas. Desafio propos construir um site completo para uma empresa de receitas chamada Foodfy.

###### **Curso :** LaunchBase - [Rocketseat](https://rocketseat.com.br)
###### **Instrutor :** Mayk Brito

## **Instruções**

Arquivo **database.sql** para a criação do banco de dados da aplicação esta disponivel na raiz do projeto, o banco de dados utilizados é o PostgreSQL.

Atualize as credencias de conexão com o banco de dados para as suas necessidades, para isto edite o arquivo **src/config/db.js**

Atualize as credencias da API de envio de emails para as suas necessidades, para isto soga as instruções do arquivo **src/lib/mailer-example.js**

**Atenção :** Antes de rodar a aplicação instale todas as dependencias do projeto, para isto rode o comando **_npm install_** .

Para iniciar o servidor da aplicação use o comando **_npm start_** , caso a aplicação não abra automaticamente em seu navegador acesse **_http://localhost:3000/_**.

## **Rotas**

**[PÚBLICO]**
- /
- /about
- /recipes
- /recipes/{id}
- /chefs
- /search
- /login
- /forgot-password
- /reset

**[ADMINISTRATIVO]**
- /admin
- /admin/recipes
- /admin/recipes/create
- /admin/recipes/{id}
- /admin/recipes/{id}/edit

- /admin/chefs
- /admin/chefs/create
- /admin/chefs/{id}
- /admin/chefs/{id}/edit

- /admin/profile
- /admin/profile/{id}/edit
- /admin/users
- /admin/users/create
- /admin/users/logout


## **Histórico**

1. Construir todo o HTML e CSS do site e deixa-lo funcionando com as especificações do desafio; 
2. Refatoramento de toda a estrutura do Foodfy, adicionado servidor próprio, pegando informações dinâmicamente, usando template engine Nunjucks, adicionado rota para pagina de erro 404, adicionado style responsivo à área pública;
3. Adicionado área administrativa ao site, para gestão de receitas(criação, edição e exclusão). Alterado arquivo base de dados, para arquivo data.json. Refatorado estrutura de arquivos, movido rotas para arquivos específicos.
4. Alterado armazenamento dos dados de arquivo JSON para banco de dados PostgreSQL; Criado novas páginas de (cadastro, listagem e edição) de chefs, agora as receitas podem ser atribuídas a um chef; Adicionado sistema de busca pelo nome das receitas; Adicionado paginação de receitas nas áreas pública e administrativa da aplicação; Adicionado verificação antes de excluir um chef, se o mesmo tiver receitas em seu nome, apresenta erro e não é excluído.
5. Adicionado sistema de upload de imagens na aplicação, para que possa ser enviadas imagens diretamente do computador do usuário; Esta opção de upload de imagens esta disponivel nas páginas de criação/edição de receitas e na criação/edição dos chefs; as imagens upadas são salvas no diretório public/images.
6. Adicionado sistema de login e recuperação de senha por email; Adicionado paginas de criação/edição/exclusão de usuários; Implementado novas logicas de negócios e validações de usuários; Refatoração da estrutura e arquivos do projeto; Adicionado mensagens informativas para os usuários.