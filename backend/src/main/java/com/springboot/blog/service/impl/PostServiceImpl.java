package com.springboot.blog.service.impl;

import com.springboot.blog.entity.Category;
import com.springboot.blog.entity.Post;
import com.springboot.blog.entity.User;
import com.springboot.blog.config.CategoryPreset;
import com.springboot.blog.exception.BlogAPIException;
import com.springboot.blog.exception.ResourceNotFoundException;
import com.springboot.blog.payload.PostDto;
import com.springboot.blog.payload.PostResponse;
import com.springboot.blog.repository.CategoryRepository;
import com.springboot.blog.repository.PostRepository;
import com.springboot.blog.repository.UserRepository;
import com.springboot.blog.service.PostService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    private static final String DEFAULT_CATEGORY_NAME = "General";

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ModelMapper mapper;

    public PostServiceImpl(PostRepository postRepository,
                           CategoryRepository categoryRepository,
                           UserRepository userRepository,
                           ModelMapper mapper) {
        this.postRepository = postRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    public PostDto createPost(PostDto postDto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Category category = resolveCategory(postDto.getCategoryId());

        Post post = mapToEntity(postDto);
        post.setId(null);
        post.setUser(user);
        post.setCategory(category);

        Post saved = postRepository.save(post);
        return mapToDto(saved);
    }

    @Override
    public PostResponse getAllPosts(int pageNo, int pageSize, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Post> posts = postRepository.findAll(pageable);

        List<PostDto> content = posts.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PostResponse(
                content,
                posts.getNumber(),
                posts.getSize(),
                posts.getTotalElements(),
                posts.getTotalPages(),
                posts.isLast()
        );
    }

    @Override
    public PostDto getPostById(long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        return mapToDto(post);
    }

    @Override
    public PostDto updatePost(PostDto postDto, long id, String username) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        enforceOwnershipOrAdmin(post, username);

        Category category = resolveCategory(postDto.getCategoryId());

        post.setTitle(postDto.getTitle());
        post.setDescription(postDto.getDescription());
        post.setContent(postDto.getContent());
        post.setCategory(category);

        Post updated = postRepository.save(post);
        return mapToDto(updated);
    }

    @Override
    public void deletePostById(long id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        enforceOwnershipOrAdmin(post, username);

        postRepository.delete(post);
    }

    @Override
    public List<PostDto> getPostsByCategory(Long categoryId) {
        return postRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PostResponse getMyPosts(String username, int pageNo, int pageSize, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<Post> posts = postRepository.findByUserUsername(username, pageable);

        List<PostDto> content = posts.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PostResponse(
                content,
                posts.getNumber(),
                posts.getSize(),
                posts.getTotalElements(),
                posts.getTotalPages(),
                posts.isLast()
        );
    }

    private Category resolveCategory(Long categoryId) {
        Category category;
        if (categoryId != null) {
            category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
        } else {
            category = categoryRepository.findByName(DEFAULT_CATEGORY_NAME)
                    .orElseThrow(() -> new BlogAPIException(
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            "Default category '" + DEFAULT_CATEGORY_NAME + "' is missing. Please restart the server to seed it."
                    ));
        }
    
        if (category.getName() == null || !CategoryPreset.allowedNames().contains(category.getName())) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Invalid category. Please choose one of the preset categories.");
        }

        return category;
    }

    private void enforceOwnershipOrAdmin(Post post, String username) {
        String owner = post.getUser() != null ? post.getUser().getUsername() : null;
        if (owner != null && owner.equals(username)) return;

        if (isAdmin()) return;

        throw new BlogAPIException(HttpStatus.FORBIDDEN, "You can only modify your own posts.");
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private PostDto mapToDto(Post post) {
        PostDto dto = mapper.map(post, PostDto.class);

        // author
        if (post.getUser() != null) {
            dto.setAuthorId(post.getUser().getId());
            dto.setAuthorUsername(post.getUser().getUsername());
            dto.setAuthorName(post.getUser().getName());
        }

        // categoryId
        if (post.getCategory() != null) {
            dto.setCategoryId(post.getCategory().getId());
        }

        return dto;
    }

    private Post mapToEntity(PostDto postDto) {
        return mapper.map(postDto, Post.class);
    }
}
