package com.springboot.blog.service;

import com.springboot.blog.payload.PostDto;
import com.springboot.blog.payload.PostResponse;

import java.util.List;

public interface PostService {

    PostDto createPost(PostDto postDto, String username);

    PostResponse getAllPosts(int pageNo, int pageSize, String sortBy, String sortDir);

    PostDto getPostById(long id);

    PostDto updatePost(PostDto postDto, long id, String username);

    void deletePostById(long id, String username);

    List<PostDto> getPostsByCategory(Long categoryId);

    PostResponse getMyPosts(String username, int pageNo, int pageSize, String sortBy, String sortDir);
}
