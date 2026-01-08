package com.springboot.blog.config;

import com.springboot.blog.entity.Role;
import com.springboot.blog.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        ensureRoleExists("ROLE_USER");
        ensureRoleExists("ROLE_ADMIN");
    }

    private void ensureRoleExists(String roleName) {
        roleRepository.findByName(roleName).orElseGet(() -> {
            Role r = new Role();
            r.setName(roleName);
            return roleRepository.save(r);
        });
    }
}
