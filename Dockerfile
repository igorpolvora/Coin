# Etapa 1: Build da aplicação (Usando Maven com Java 21)
FROM eclipse-temurin:21-jdk-alpine as builder

WORKDIR /app
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x ./mvnw

# Baixa as dependências offline para otimizar builds futuros
RUN ./mvnw dependency:go-offline

COPY src src
# Compila e cria o .jar ignorando os testes
RUN ./mvnw package -DskipTests

# Etapa 2: Imagem super leve para execução (Apenas o JRE)
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
