# Coin API

API RESTful desenvolvida com Spring Boot 3.3 para gerenciamento de moedas/transações.

## Requisitos

- **Java**: 21
- **Maven**: 3.8.0+
- **PostgreSQL**: 12+

## Configuração

### 1. Banco de Dados

Crie o banco de dados PostgreSQL:

```sql
CREATE DATABASE coin_db;
```

### 2. Propriedades da Aplicação

O arquivo `application.properties` já está configurado com:
- **Datasource**: PostgreSQL local em `localhost:5432/coin_db`
- **Username**: `postgres`
- **Password**: (configurar conforme necessário)
- **JPA**: `ddl-auto=update` (criar/atualizar tabelas automaticamente)
- **JWT**: Secret configurado e expiração em 24 horas

### 3. Segredo JWT

O segredo JWT padrão é um Base64 de 256 bits. Para produção, altere em `application.properties`:

```properties
jwt.secret=SEU_SECRET_BASE64_256BITS
jwt.expiration=86400000
```

## Compilação e Execução

### Build

```bash
mvn clean install
```

### Executar

```bash
mvn spring-boot:run
```

A aplicação iniciará em `http://localhost:8080`

## Dependências Principais

- **Spring Boot Starter Web**: APIs RESTful
- **Spring Data JPA**: Acesso a dados com Hibernate
- **Spring Security**: Autenticação e autorização
- **JJWT 0.12.3**: Geração e validação de JWT
- **Lombok**: Redução de boilerplate com anotações
- **PostgreSQL Driver**: Conectividade com banco de dados

## Estrutura do Projeto

```
coin-api/
├── src/main/java/com/igor/coin/
│   └── CoinApiApplication.java
├── src/main/resources/
│   └── application.properties
├── src/test/
└── pom.xml
```

## Próximos Passos

1. Implementar entidades JPA (`@Entity`)
2. Criar repositórios (`@Repository`)
3. Desenvolver serviços (`@Service`)
4. Criar controladores (`@RestController`)
5. Implementar autenticação JWT
6. Adicionar validações e tratamento de exceções
