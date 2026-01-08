package com.springboot.blog.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.Instant;
import java.util.Set;

@Data
@Schema(description = "PostDto Model Information")
public class PostDto {
    private long id;

    @Schema(description = "Blog Post Title")
    @NotEmpty
    @Size(min = 2, message = "Post title should have at least 2 characters")
    private String title;

    @Schema(description = "Blog Post Description")
    @NotEmpty
    @Size(min = 10, message = "Post description should have at least 10 characters")
    private String description;

    @Schema(description = "Blog Post Content")
    @NotEmpty
    private String content;

    private Instant createdAt;
    private Instant updatedAt;

    // author info (server-populated)
    private Long authorId;
    private String authorUsername;
    private String authorName;

    private Set<CommentDto> comments;

    @Schema(description = "Blog Post Category")
    private Long categoryId;
}
