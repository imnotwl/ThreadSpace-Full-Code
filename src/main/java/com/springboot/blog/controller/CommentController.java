package com.springboot.blog.controller;

import com.springboot.blog.payload.CommentDto;
import com.springboot.blog.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // Create comment (authenticated)
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentDto> createComment(@PathVariable(value = "postId") long postId,
                                                    @Valid @RequestBody CommentDto commentDto,
                                                    Principal principal) {
        CommentDto saved = commentService.createComment(postId, commentDto, principal.getName());
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Get all comments for a post (public)
    @GetMapping("/posts/{postId}/comments")
    public List<CommentDto> getCommentsByPostId(@PathVariable(value = "postId") long postId) {
        return commentService.getCommentsByPostId(postId);
    }

    // Update comment (only author or ADMIN)
    @PutMapping("/posts/{postId}/comments/{id}")
    public ResponseEntity<CommentDto> updateComment(@PathVariable(value = "postId") Long postId,
                                                    @PathVariable(value = "id") Long commentId,
                                                    @Valid @RequestBody CommentDto commentDto,
                                                    Principal principal) {
        CommentDto updatedComment = commentService.updateComment(postId, commentId, commentDto, principal.getName());
        return new ResponseEntity<>(updatedComment, HttpStatus.OK);
    }

    // Delete comment (only author or ADMIN)
    @DeleteMapping("/posts/{postId}/comments/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable(value = "postId") Long postId,
                                                @PathVariable(value = "id") Long commentId,
                                                Principal principal) {
        commentService.deleteComment(postId, commentId, principal.getName());
        return new ResponseEntity<>("Comment deleted successfully", HttpStatus.OK);
    }
}
