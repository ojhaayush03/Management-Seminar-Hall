package com.example.seminarhall;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.seminarhall")
@EnableWebMvc
public class SeminarhallApplication {

    public static void main(String[] args) {
        SpringApplication.run(SeminarhallApplication.class, args);
    }

}
