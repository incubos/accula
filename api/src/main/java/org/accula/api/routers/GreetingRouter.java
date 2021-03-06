package org.accula.api.routers;

import lombok.RequiredArgsConstructor;
import org.accula.api.handlers.GreetingHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Component
@RequiredArgsConstructor
public final class GreetingRouter {
    private final GreetingHandler handler;

    @Bean
    public RouterFunction<ServerResponse> greetingRoute() {
        return RouterFunctions
                .route()
                .GET("/api/greet", handler::greet)
                .build();
    }
}
