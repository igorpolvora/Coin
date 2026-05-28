# Etapa 1: Build da aplicação (Usando Maven com Java 21)
FROM maven:3.9.7-eclipse-temurin-21-alpine as builder

WORKDIR /app
COPY pom.xml .

# Baixa as dependências offline para otimizar builds futuros
RUN mvn dependency:go-offline

COPY src src
# Compila e cria o .jar ignorando os testes
RUN mvn package -DskipTests

# Etapa 2: Imagem super leve para execução (Apenas o JRE)
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
