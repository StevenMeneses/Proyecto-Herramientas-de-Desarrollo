package com.example.Proyecto_HD;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test") 
@TestPropertySource(locations = "classpath:application-test.properties")
class ProyectoHdApplicationTests {

	@Test
	void contextLoads() {
		// This test verifies that the Spring application context loads successfully
		// If this test passes, it means all Spring components are configured correctly
	}

}
