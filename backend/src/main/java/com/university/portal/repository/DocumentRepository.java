package com.university.portal.repository;

import com.university.portal.model.DocumentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<DocumentRecord, Long> {
    List<DocumentRecord> findByUserId(Long userId);
    List<DocumentRecord> findByUniversity(String university);
}
