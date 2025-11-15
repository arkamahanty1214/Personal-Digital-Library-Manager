package com.example.library.repository;

import com.example.library.entity.LibraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LibraryItemRepository extends JpaRepository<LibraryItem, Long> {
    List<LibraryItem> findByTitleContainingIgnoreCase(String title);
    List<LibraryItem> findByCategory(String category);
}
