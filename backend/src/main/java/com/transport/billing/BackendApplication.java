package com.transport.billing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
        
        String dbUrl = System.getenv("DB_URL");
        if (dbUrl == null || dbUrl.trim().isEmpty()) {
            System.err.println("====================================================================");
            System.err.println("CRITICAL ERROR: DB_URL environment variable is missing!");
            System.err.println("Please configure DB_URL, DB_USERNAME, and DB_PASSWORD in Render.");
            System.err.println("====================================================================");
        } else if (!dbUrl.startsWith("jdbc:postgresql://")) {
            System.err.println("====================================================================");
            System.err.println("WARNING: DB_URL does not start with 'jdbc:postgresql://'");
            System.err.println("If it starts with 'postgres://', change it to 'jdbc:postgresql://'!");
            System.err.println("====================================================================");
        }
        
        SpringApplication.run(BackendApplication.class, args);
    }
}
