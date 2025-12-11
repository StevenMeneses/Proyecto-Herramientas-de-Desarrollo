package com.example.Proyecto_HD.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.HeaderWriterLogoutHandler;
import org.springframework.security.web.header.writers.ClearSiteDataHeaderWriter;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.springframework.security.web.header.writers.ClearSiteDataHeaderWriter.Directive.*;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;
    
    @Autowired
    private ForceSessionAuthenticationSuccessHandler forceSessionAuthenticationSuccessHandler;
    
    @Autowired
    private ForceSessionSecurityContextFilter forceSessionSecurityContextFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public org.springframework.security.core.session.SessionRegistry sessionRegistry() {
        return new org.springframework.security.core.session.SessionRegistryImpl();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Habilitar CORS definido en CorsConfig
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .authorizeHttpRequests(authz -> authz
                // Permitir acceso público a estas rutas
                .requestMatchers("/login", "/registro/**", "/css/**", "/js/**", "/images/**", "/static/**").permitAll()
                // Permitir acceso a React app (si está servida desde Spring Boot)
                .requestMatchers("/", "/index.html", "/manifest.json", "/robots.txt").permitAll()
                .requestMatchers("/static/**", "/asset-manifest.json").permitAll()
                // Permitir acceso público a archivos de prueba
                .requestMatchers("/test-auth.html").permitAll()
                // Permitir acceso público a endpoints de verificación y auth
                .requestMatchers("/api/auth/**", "/api/test/**", "/api/logout").permitAll()
                // Solo estas rutas específicas requieren autenticación
                .requestMatchers("/api/usuario/datos", "/api/auth/check").authenticated()
                // Rutas específicas por rol
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/vendedor/**").hasRole("VENDEDOR")
                .requestMatchers("/cliente/**").hasRole("CLIENTE")
                .requestMatchers("/dashboard", "/perfil").authenticated()
                // Permitir todo lo demás temporalmente para debug
                .anyRequest().permitAll()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .usernameParameter("email")
                .passwordParameter("contrasena")
                .successHandler(forceSessionAuthenticationSuccessHandler)
                .failureUrl("/login?error=true")
                .permitAll()
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    // Para rutas de API, devolver JSON 401
                    if (request.getRequestURI().startsWith("/api/")) {
                        response.setContentType("application/json");
                        response.setStatus(401);
                        response.getWriter().write("{\"error\":\"No autenticado\",\"message\":\"" + authException.getMessage() + "\"}");
                    } else {
                        // Para otras rutas, redirigir al login
                        response.sendRedirect("/login");
                    }
                })
            )
           .logout(logout -> logout
    .logoutUrl("/logout")
    .logoutSuccessHandler((request, response, authentication) -> {
        // Determinar URL base según entorno
        String host = request.getServerName();
        String baseUrl;
        
        if (host.contains("render.com") || host.contains("proyecto-herramientas-de-desarrollo-3")) {
            baseUrl = "https://proyecto-herramientas-de-desarrollo-3.onrender.com";
        } else {
            baseUrl = "http://localhost:8080";
        }
        
        // Para peticiones de API (React/AJAX), devolver JSON
        if (request.getRequestURI().startsWith("/api/")) {
            response.setContentType("application/json");
            response.setStatus(200);
            response.getWriter().write("{\"success\": true, \"message\": \"Sesión cerrada\", \"redirectUrl\": \"" + baseUrl + "\"}");
        } else {
            // Para peticiones normales (Thymeleaf/navegador), redirigir al inicio
            response.sendRedirect(baseUrl);
        }
    })
    .invalidateHttpSession(true)
    .deleteCookies("JSESSIONID")
    .addLogoutHandler(new HeaderWriterLogoutHandler(
        new ClearSiteDataHeaderWriter(COOKIES, CACHE, STORAGE)
    ))
    .permitAll()
)
            .csrf(csrf -> csrf
                // Ignorar CSRF para endpoints que reciben peticiones cross-origin (React app)
                .ignoringRequestMatchers("/api/**", "/registro/**", "/login", "/logout")
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.ALWAYS)
                .maximumSessions(10) // Permitir múltiples sesiones para debug
                .maxSessionsPreventsLogin(false)
                .sessionRegistry(sessionRegistry())
            )
            // Agregar filtro personalizado para forzar carga de contexto desde sesión
            .addFilterBefore(forceSessionSecurityContextFilter, 
                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}