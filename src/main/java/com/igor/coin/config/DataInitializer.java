package com.igor.coin.config;

import com.igor.coin.entity.User;
import com.igor.coin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (userRepository.findByEmail("admin@coin.com").isEmpty()) {
                User defaultUser = User.builder()
                        .name("Administrador")
                        .email("admin@coin.com")
                        .password("default_password")
                        .build();
                userRepository.save(defaultUser);
                System.out.println("Default user created: admin@coin.com");
            }
        };
    }
}
