FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar primero los archivos de configuración de Maven
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw

# Copiar el código fuente
COPY src ./src

# Compilar la aplicación
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

# Copiar el JAR generado
COPY --from=build /app/target/*.jar app.jar

# Crear directorio para la base de datos SQLite
RUN mkdir -p /app/data

EXPOSE 8080

# Ejecutar con perfil production explícitamente
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=production", "app.jar"]