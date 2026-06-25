package com.university.portal.service;

import com.university.portal.model.UserEntity;
import com.university.portal.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class PortalServiceTest {

    @Autowired
    private PortalService portalService;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void cleanup() {
        userRepository.deleteAll();
    }

    @Test
    void registerAndLoginUserWithHashedPassword() {
        UserEntity user = new UserEntity();
        user.setFirstName("Anele");
        user.setLastName("Mokoena");
        user.setEmail("anele@example.com");
        user.setPhone("0712345678");
        user.setPassword("SecurePass123");

        UserEntity saved = portalService.registerUser(user);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getPassword()).isNotEqualTo("SecurePass123");

        Optional<UserEntity> authenticated = portalService.login("anele@example.com", "SecurePass123");

        assertThat(authenticated).isPresent();
        assertThat(authenticated.get().getEmail()).isEqualTo("anele@example.com");
    }
}
