package com.springboot.blog.config;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public enum CategoryPreset {
    GENERAL("General", "Default category for general discussion."),
    ANNOUNCEMENTS("Announcements", "Official announcements and updates."),
    QUESTIONS("Questions", "Ask for help or clarification."),
    GUIDES("Guides", "Tutorials, walkthroughs, and how‑tos."),
    SHOWCASE("Showcase", "Share your work, projects, and wins."),
    FEEDBACK("Feedback", "Give/receive feedback and suggestions."),
    BUGS("Bugs", "Report issues and unexpected behavior."),
    OFF_TOPIC("Off Topic", "Anything that doesn’t fit elsewhere."),
    EVENTS("Events", "Meetups, deadlines, and community events."),
    RESOURCES("Resources", "Links, tools, and helpful materials.");

    public static final String DEFAULT_CATEGORY_NAME = "General";

    private final String name;
    private final String description;

    CategoryPreset(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public static Set<String> allowedNames() {
        return Arrays.stream(values()).map(CategoryPreset::getName).collect(Collectors.toSet());
    }
}
