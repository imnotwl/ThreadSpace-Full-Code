package com.springboot.blog.service.impl;

import com.springboot.blog.exception.BlogAPIException;
import com.springboot.blog.payload.CategoryDto;
import com.springboot.blog.repository.CategoryRepository;
import com.springboot.blog.service.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    public CategoryServiceImpl(CategoryRepository categoryRepository, ModelMapper modelMapper) {
        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public CategoryDto addCategory(CategoryDto categoryDto) {
        throw new BlogAPIException(HttpStatus.FORBIDDEN, "Categories are preset and cannot be created.");
    }

    @Override
    public CategoryDto getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .map(category -> modelMapper.map(category, CategoryDto.class))
                .orElseThrow(() -> new com.springboot.blog.exception.ResourceNotFoundException("Category", "id", categoryId));
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> modelMapper.map(category, CategoryDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDto updateCategory(CategoryDto categoryDto, Long categoryId) {
        throw new BlogAPIException(HttpStatus.FORBIDDEN, "Categories are preset and cannot be updated.");
    }

    @Override
    public void deleteCategory(Long categoryId) {
        throw new BlogAPIException(HttpStatus.FORBIDDEN, "Categories are preset and cannot be deleted.");
    }
}
