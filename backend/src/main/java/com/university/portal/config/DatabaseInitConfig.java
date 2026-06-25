package com.university.portal.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseInitConfig {

    @Bean
    CommandLineRunner initDatabase(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS users (id BIGINT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, phone VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)");
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS applications (id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id BIGINT, university VARCHAR(255), course VARCHAR(255), status VARCHAR(255), submitted_date DATE)");
            } catch (Exception ex) {
                System.err.println("Database init warning: " + ex.getMessage());
            }
        };
    }
}
