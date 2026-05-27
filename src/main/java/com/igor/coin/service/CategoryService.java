package com.igor.coin.service;

import com.igor.coin.dto.CategoryRequest;
import com.igor.coin.dto.CategoryResponse;
import com.igor.coin.entity.Category;
import com.igor.coin.entity.User;
import com.igor.coin.exception.ResourceNotFoundException;
import com.igor.coin.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAll(User user) {
        return categoryRepository.findAllByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getById(Long id, User user) {
        Category category = getCategoryByIdAndUser(id, user);
        return mapToResponse(category);
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request, User user) {
        Category category = Category.builder()
                .user(user)
                .name(request.getName())
                .icon(request.getIcon())
                .color(request.getColor())
                .type(request.getType())
                .build();
        return mapToResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request, User user) {
        Category category = getCategoryByIdAndUser(id, user);
        category.setName(request.getName());
        category.setIcon(request.getIcon());
        category.setColor(request.getColor());
        category.setType(request.getType());
        return mapToResponse(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id, User user) {
        Category category = getCategoryByIdAndUser(id, user);
        categoryRepository.delete(category);
    }

    public Category getCategoryByIdAndUser(Long id, User user) {
        return categoryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
    }

    public CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .icon(category.getIcon())
                .color(category.getColor())
                .type(category.getType())
                .build();
    }
}
