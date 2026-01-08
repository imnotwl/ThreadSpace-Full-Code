package com.springboot.blog.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.Instant;

@Data
@Schema(description = "CommentDto Model Information")
public class CommentDto {

    private Long id;

    @Schema(description = "Comment Body")
    @NotEmpty
    @Size(min = 1, message = "Comment body must not be empty")
    private String body;

    private Instant createdAt;
    private Instant updatedAt;

    private Long authorId;
    private String authorUsername;
    private String authorName;
}
