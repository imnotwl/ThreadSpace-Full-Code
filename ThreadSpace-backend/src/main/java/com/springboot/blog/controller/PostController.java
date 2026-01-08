package com.springboot.blog.controller;

import com.springboot.blog.payload.PostDto;
import com.springboot.blog.payload.PostResponse;
import com.springboot.blog.service.PostService;
import com.springboot.blog.utils.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Tag(
        name = "CRUD REST APIs for Post Resource",
        description = "CRUD REST APIs - Create Post, Update Post, Get Post, Get All Posts, Delete Post"
)
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @Operation(summary = "Create Post REST API", description = "Create Post REST API is used to save post in a database")
    @ApiResponse(responseCode = "201", description = "Http Status 201 CREATED")
    @PostMapping
    public ResponseEntity<PostDto> createPost(@Valid @RequestBody PostDto postDto, Principal principal) {
        return new ResponseEntity<>(postService.createPost(postDto, principal.getName()), HttpStatus.CREATED);
    }

    @Operation(summary = "Get All Posts REST API", description = "Fetch paginated posts")
    @ApiResponse(responseCode = "200", description = "Http Status 200 SUCCESS")
    @GetMapping
    public PostResponse getAllPosts(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir
    ) {
        return postService.getAllPosts(pageNo, pageSize, sortBy, sortDir);
    }

    @Operation(summary = "Get Post By Id REST API", description = "Fetch a single post by id")
    @ApiResponse(responseCode = "200", description = "Http Status 200 SUCCESS")
    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable(name = "id") long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @Operation(summary = "Update Post REST API", description = "Update a post (only the author or ADMIN)")
    @ApiResponse(responseCode = "200", description = "Http Status 200 SUCCESS")
    @PutMapping("/{id}")
    public ResponseEntity<PostDto> updatePost(@Valid @RequestBody PostDto postDto,
                                              @PathVariable(name = "id") long id,
                                              Principal principal) {
        PostDto updated = postService.updatePost(postDto, id, principal.getName());
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete Post REST API", description = "Delete a post (only the author or ADMIN)")
    @ApiResponse(responseCode = "200", description = "Http Status 200 SUCCESS")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable(name = "id") long id, Principal principal) {
        postService.deletePostById(id, principal.getName());
        return new ResponseEntity<>("Post entity deleted successfully.", HttpStatus.OK);
    }

    // Get posts by category
    // http://localhost:8080/api/posts/category/3
    @GetMapping("/category/{id}")
    public ResponseEntity<List<PostDto>> getPostsByCategory(@PathVariable("id") Long categoryId) {
        List<PostDto> postDtos = postService.getPostsByCategory(categoryId);
        return ResponseEntity.ok(postDtos);
    }
}
