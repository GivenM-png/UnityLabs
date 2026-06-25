package com.university.portal.service;

import com.university.portal.model.ApplicationEntity;
import com.university.portal.model.DocumentRecord;
import com.university.portal.model.UserEntity;
import com.university.portal.repository.ApplicationRepository;
import com.university.portal.repository.DocumentRepository;
import com.university.portal.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PortalService {
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;

    public PortalService(UserRepository userRepository, ApplicationRepository applicationRepository, DocumentRepository documentRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.documentRepository = documentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserEntity registerUser(UserEntity user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<UserEntity> login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()));
    }

    public ApplicationEntity submitApplication(ApplicationEntity application) {
        return applicationRepository.save(application);
    }

    public List<ApplicationEntity> getApplications(Long userId) {
        return applicationRepository.findByUserId(userId);
    }

    public DocumentRecord saveDocument(DocumentRecord document) {
        return documentRepository.save(document);
    }

    public List<DocumentRecord> getDocuments(Long userId) {
        return documentRepository.findByUserId(userId);
    }
}
