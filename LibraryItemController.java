package com.example.library.controller;

import com.example.library.entity.LibraryItem;
import com.example.library.repository.LibraryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class LibraryItemController {

    @Autowired
    private LibraryItemRepository repository;

    @GetMapping
    public List<LibraryItem> getAllItems() {
        return repository.findAll();
    }

    @PostMapping
    public LibraryItem createItem(@RequestBody LibraryItem item) {
        return repository.save(item);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<LibraryItem> markAsRead(@PathVariable Long id) {
        Optional<LibraryItem> itemOptional = repository.findById(id);
        if (itemOptional.isPresent()) {
            LibraryItem item = itemOptional.get();
            item.setReadStatus(true);
            return ResponseEntity.ok(repository.save(item));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
