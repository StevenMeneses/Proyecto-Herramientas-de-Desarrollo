package com.example.Proyecto_HD.config;

import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@Component
public class ForceSessionSecurityContextFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, 
                                  @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        // Solo procesar si no hay autenticación activa o es anonymous
        Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAnonymous = currentAuth == null || 
                            "anonymousUser".equals(currentAuth.getName()) ||
                            !currentAuth.isAuthenticated();
        
        if (isAnonymous) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                
                // Intentar cargar el contexto desde la sesión
                SecurityContext sessionContext = (SecurityContext) session.getAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
                
                if (sessionContext != null && sessionContext.getAuthentication() != null) {
                    Authentication sessionAuth = sessionContext.getAuthentication();
                    
                    System.out.println("🔄 FORCE FILTER: Restaurando autenticación desde sesión");
                    System.out.println("   👤 Usuario: " + sessionAuth.getName());
                    System.out.println("   🎭 Authorities: " + sessionAuth.getAuthorities());
                    System.out.println("   🆔 Session ID: " + session.getId());
                    
                    // Forzar la autenticación en el contexto actual
                    SecurityContextHolder.setContext(sessionContext);
                    
                    System.out.println("✅ Autenticación restaurada exitosamente");
                }
            }
        }
        
        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}