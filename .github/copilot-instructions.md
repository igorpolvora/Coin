# Coin API - Copilot Instructions

Este é um projeto Spring Boot 3.3 com Maven para uma API de gerenciamento de moedas.

## Configuração do Projeto

- **Linguagem**: Java 21
- **Framework**: Spring Boot 3.3.0
- **Build Tool**: Maven
- **Banco de Dados**: PostgreSQL

## Dependências Principais

- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-data-rest
- postgresql (driver)
- lombok
- jjwt (JSON Web Token) 0.12.3

## Configurações Importantes

### Banco de Dados
- URL: `jdbc:postgresql://localhost:5432/coin_db`
- Usuário: `postgres`
- DDL Auto: `update`

### JWT
- Secret: Base64 de 256 bits (configurado em application.properties)
- Expiração: 24 horas (86400000 ms)

### Servidor
- Porta: 8080

## Estrutura de Pacotes

```
com.igor.coin
├── config         # Configurações de segurança e JWT
├── controller     # Controladores REST
├── service        # Serviços de negócio
├── repository     # Repositórios JPA
├── entity         # Entidades JPA
├── dto            # Data Transfer Objects
├── exception      # Exceções customizadas
└── security       # Utilitários de segurança JWT
```

## Como Compilar e Executar

**Build:**
```bash
mvn clean install
```

**Executar:**
```bash
mvn spring-boot:run
```

**Testes:**
```bash
mvn test
```

## Dicas de Desenvolvimento

1. Use `@Slf4j` (Lombok) para logging
2. Implemente `@Configuration` para beans customizados
3. Use Spring Security para proteger endpoints
4. Valide inputs com `@Valid` e `@Validated`
5. Implemente tratamento de erros com `@ControllerAdvice`
