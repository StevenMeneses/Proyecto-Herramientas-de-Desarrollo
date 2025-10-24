package com.example.Proyecto_HD.config;

import com.example.Proyecto_HD.service.CustomUserDetailsService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@Component
public class ForceSessionAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, 
                                      Authentication authentication) throws IOException, ServletException {
        
        System.out.println("=== FORCE SESSION SUCCESS HANDLER ===");
        System.out.println("✅ Autenticación exitosa para: " + authentication.getName());
        System.out.println("🎭 Authorities: " + authentication.getAuthorities());
        
        // Obtener o crear sesión
        HttpSession session = request.getSession(true);
        System.out.println("🆔 Session ID: " + session.getId());
        System.out.println("🆔 Session isNew: " + session.isNew());
        
        // CRÍTICO: Forzar el guardado del contexto de seguridad en la sesión
        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(authentication);
        
        // Guardar explícitamente en la sesión HTTP
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
        
        System.out.println("💾 SecurityContext guardado en sesión");
        System.out.println("🔐 Authentication en contexto: " + securityContext.getAuthentication().getName());
        
        // Guardar información adicional en la sesión para debug
        session.setAttribute("authenticated", true);
        session.setAttribute("loginTime", System.currentTimeMillis());
        session.setAttribute("username", authentication.getName());
        
        // Si es CustomUserPrincipal, guardar datos adicionales
        if (authentication.getPrincipal() instanceof CustomUserDetailsService.CustomUserPrincipal) {
            CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();
                
            session.setAttribute("userId", userPrincipal.getUsuario().getIdUsuario());
            session.setAttribute("userEmail", userPrincipal.getUsername());
            session.setAttribute("userRole", userPrincipal.getUsuario().getIdRol());
            
            System.out.println("👤 Usuario ID: " + userPrincipal.getUsuario().getIdUsuario());
            System.out.println("📧 Email: " + userPrincipal.getUsername());
            System.out.println("🎭 Rol: " + userPrincipal.getUsuario().getIdRol());
        }
        
        // Configurar headers para CORS
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        
        // Forzar cookie de sesión
        response.addHeader("Set-Cookie", 
            "JSESSIONID=" + session.getId() + 
            "; Path=/; SameSite=None; Secure=false");
        
        System.out.println("🍪 Cookie JSESSIONID configurado");
        
        // Determinar destino de redirección
        String targetUrl = determineTargetUrl(request, authentication);
        System.out.println("🎯 Redirigiendo a: " + targetUrl);
        
        response.sendRedirect(targetUrl);
    }
    
    private String determineTargetUrl(HttpServletRequest request, Authentication authentication) {
        // ✅ DETECCIÓN DINÁMICA DE ENTORNO
        String serverName = request.getServerName();
        boolean isProduction = serverName.contains("render.com");
        String frontendUrl = isProduction 
            ? "https://proyecto-herramientas-de-desarrollo.onrender.com"
            : "http://localhost:3000";
        
        System.out.println("🌍 Entorno detectado:");
        System.out.println("   - Server: " + serverName);
        System.out.println("   - Producción: " + isProduction);
        System.out.println("   - Frontend URL: " + frontendUrl);
        
        // Verificar si hay un parámetro de redirección desde React
        String redirectParam = request.getParameter("redirect");
        if ("react".equals(redirectParam)) {
            return frontendUrl + "/dashboard";  // ✅ URL DINÁMICA
        }
        
        // Verificar si la petición viene de React (por el origen)
        String origin = request.getHeader("Origin");
        if (origin != null && (origin.contains("localhost:3000") || origin.contains("render.com"))) {
            return frontendUrl + "/dashboard";  // ✅ URL DINÁMICA
        }
        
        // Para requests desde la aplicación Spring Boot, ir al endpoint de verificación
        return "/api/test/login-status?redirect=true&force=true";
    }
}