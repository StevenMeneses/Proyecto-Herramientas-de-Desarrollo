# ============================================
# ETAPA 1: CONSTRUCCIÓN
# ============================================
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de Maven primero (para mejor caching)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw

# Descargar dependencias
RUN ./mvnw dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Compilar aplicación
RUN ./mvnw clean package -DskipTests

# ============================================
# ETAPA 2: EJECUCIÓN
# ============================================
FROM eclipse-temurin:21-jre-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# ⭐⭐ CREAR DIRECTORIO PARA SQLITE ⭐⭐
# Este directorio será persistente en Render
RUN mkdir -p /app/data
RUN chmod 755 /app/data

# Copiar JAR desde etapa de construcción
COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

# Puerto expuesto
EXPOSE 8080

# Variables de entorno por defecto
ENV SPRING_PROFILES_ACTIVE=production
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC"

# Comando de ejecución
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app/app.jar"]