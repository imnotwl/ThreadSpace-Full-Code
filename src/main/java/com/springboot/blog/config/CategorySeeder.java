package com.springboot.blog.config;

import com.springboot.blog.entity.Category;
import com.springboot.blog.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CategorySeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    public CategorySeeder(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        for (CategoryPreset preset : CategoryPreset.values()) {
            categoryRepository.findByName(preset.getName()).orElseGet(() -> {
                Category c = new Category();
                c.setName(preset.getName());
                c.setDescription(preset.getDescription());
                return categoryRepository.save(c);
            });
        }
    }
}
