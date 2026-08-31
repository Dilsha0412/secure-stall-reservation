package com.bookfair.security;

import org.springframework.stereotype.Component;

@Component
public class XssSanitizer {

    public static String sanitize(String input) {
        if (input == null) {
            return null;
        }

        // Remove script tags and contents
        String sanitized = input.replaceAll("(?i)<script.*?>.*?</script>", "");

        // Remove inline event handlers (e.g. onload=, onclick=, onerror=)
        sanitized = sanitized.replaceAll("(?i)on[a-z]+\\s*=\\s*\"[^\"]*\"", "");
        sanitized = sanitized.replaceAll("(?i)on[a-z]+\\s*=\\s*'[^']*'", "");
        sanitized = sanitized.replaceAll("(?i)on[a-z]+\\s*=\\s*[^\\s>]+", "");

        // Remove javascript: pseudo protocol
        sanitized = sanitized.replaceAll("(?i)javascript\\s*:", "");

        // Escape HTML special characters
        sanitized = sanitized
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");

        return sanitized.trim();
    }
}
