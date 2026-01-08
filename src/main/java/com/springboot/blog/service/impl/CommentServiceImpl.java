package com.springboot.blog.service.impl;

import com.springboot.blog.entity.Comment;
import com.springboot.blog.entity.Post;
import com.springboot.blog.entity.User;
import com.springboot.blog.exception.BlogAPIException;
import com.springboot.blog.exception.ResourceNotFoundException;
import com.springboot.blog.payload.CommentDto;
import com.springboot.blog.repository.CommentRepository;
import com.springboot.blog.repository.PostRepository;
import com.springboot.blog.repository.UserRepository;
import com.springboot.blog.service.CommentService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ModelMapper mapper;

    public CommentServiceImpl(CommentRepository commentRepository,
                              PostRepository postRepository,
                              UserRepository userRepository,
                              ModelMapper mapper) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    public CommentDto createComment(long postId, CommentDto commentDto, String username) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Comment comment = new Comment();
        comment.setBody(commentDto.getBody());
        comment.setPost(post);
        comment.setUser(user);

        Comment saved = commentRepository.save(comment);
        return mapToDto(saved);
    }

    @Override
    public List<CommentDto> getCommentsByPostId(long postId) {
        return commentRepository.findByPostId(postId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CommentDto getCommentById(Long postId, Long commentId) {
        Comment comment = getCommentEntity(postId, commentId);
        return mapToDto(comment);
    }

    @Override
    public CommentDto updateComment(Long postId, Long commentId, CommentDto commentRequest, String username) {

        Comment comment = getCommentEntity(postId, commentId);

        enforceOwnershipOrAdmin(comment, username);

        comment.setBody(commentRequest.getBody());

        Comment updated = commentRepository.save(comment);
        return mapToDto(updated);
    }

    @Override
    public void deleteComment(Long postId, Long commentId, String username) {
        Comment comment = getCommentEntity(postId, commentId);

        enforceOwnershipOrAdmin(comment, username);

        commentRepository.delete(comment);
    }

    private Comment getCommentEntity(Long postId, Long commentId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (comment.getPost() == null || comment.getPost().getId() == null || !comment.getPost().getId().equals(post.getId())) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Comment does not belong to post");
        }

        return comment;
    }

    private void enforceOwnershipOrAdmin(Comment comment, String username) {
        String owner = comment.getUser() != null ? comment.getUser().getUsername() : null;
        if (owner != null && owner.equals(username)) return;

        if (isAdmin()) return;

        throw new BlogAPIException(HttpStatus.FORBIDDEN, "You can only modify your own comments.");
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private CommentDto mapToDto(Comment comment) {
        CommentDto dto = mapper.map(comment, CommentDto.class);

        if (comment.getUser() != null) {
            dto.setAuthorId(comment.getUser().getId());
            dto.setAuthorUsername(comment.getUser().getUsername());
            dto.setAuthorName(comment.getUser().getName());
        }

        return dto;
    }
}
