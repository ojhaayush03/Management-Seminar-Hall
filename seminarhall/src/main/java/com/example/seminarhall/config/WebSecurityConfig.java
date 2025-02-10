package com.example.seminarhall.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Disable CSRF (for testing purposes)
                .authorizeHttpRequests(authz -> authz
                        .anyRequest().permitAll()  // Allow all requests without authentication
                )
                .httpBasic(httpBasic -> httpBasic.disable()); // Disable HTTP Basic Authentication
        return http.build();
    }
}
