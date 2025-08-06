# 🛠️ Instruções para configuração do banco de dados

Este projeto utiliza **PostgreSQL** com **Docker** e gerencia o schema do banco via **Knex.js**.

---

## 🚀 1. Subir o banco de dados com Docker

Certifique-se de que o Docker esteja instalado e em execução.

No terminal, execute:

```bash
docker-compose up -d
```

Esse comando irá:

- Baixar a imagem do PostgreSQL (caso não tenha ainda)
- Subir um container com o banco de dados
- Criar os volumes e a rede necessários

---

## 🔧 2. Executar as migrations

Após o banco estar rodando, aplique as migrations para criar as tabelas necessárias:

```bash
npx knex migrate:latest
```

Se quiser desfazer a última migration:

```bash
npx knex migrate:rollback
```

---

## 🌱 3. Rodar os seeds

Com as tabelas criadas, você pode popular o banco com dados iniciais usando os seeds:

```bash
npx knex seed:run
```

Esse comando irá executar todos os arquivos de seed na pasta `db/seeds`.

---

## ✅ Verificação (opcional)

Para verificar se o banco foi corretamente populado, acesse o container:

```bash
docker exec -it postgres-database psql -U postgres -d policia_db
```

E dentro do psql, execute:

```sql
SELECT * FROM agentes;
SELECT * FROM casos;
```

---

> Em caso de dúvidas, verifique se o `.env` está configurado corretamente com os dados de conexão do banco.
