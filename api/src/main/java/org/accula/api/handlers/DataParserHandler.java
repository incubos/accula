package org.accula.api.handlers;

import org.accula.api.model.FileModel;
import org.accula.api.model.GitPullRequest;
import org.accula.api.model.PullRequestModel;
import org.accula.api.model.WebHookModel;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class DataParserHandler {

    public Flux<GitPullRequest> getAllPR(@NotNull final String repo, @NotNull final Integer page){
        //TODO: error handling
        String api = "https://api.github.com";
        WebClient cl = WebClient.create(api);
        return cl.get()
                .uri("/repos/" + repo + "/pulls?state=all&per_page=100&page=" + page)
                .exchange()
                .flatMapMany(rs -> {
                    if (!rs.headers().header("link").isEmpty()){
                        if (rs.headers().header("link").get(0).contains("rel=\"next\""))
                            return rs.bodyToFlux(GitPullRequest.class).concatWith(getAllPR(repo, page + 1));
                    }
                    return rs.bodyToFlux(GitPullRequest.class);
                });
    }

    public Flux<FileModel> getChangedFiles(@NotNull final String repo, @NotNull final Integer page){
        //TODO: error handling
        WebClient cl = WebClient.create(repo);
        return cl.get()
                .uri("/files?per_page=100&page=" + page)
                .exchange()
                .flatMapMany(rs -> {
                    if (!rs.headers().header("link").isEmpty()){
                        if (rs.headers().header("link").get(0).contains("rel=\"next\""))
                            return rs.bodyToFlux(FileModel.class).concatWith(getChangedFiles(repo, page + 1));
                    }
                    return rs.bodyToFlux(FileModel.class);
                });
    }

    public Flux<PullRequestModel> getProject(@NotNull final String repo){
        return getAllPR(repo,1).flatMap(pr -> {
           Mono<PullRequestModel> pull_request = getChangedFiles(pr.getUrl(), 1).collectList().flatMap(f -> {
               //TODO: filter files by name
               return Mono.just(new PullRequestModel(pr,f));
           });
           return pull_request;
        });
    }

    @NotNull
    public Mono<ServerResponse> getOldProjects(@NotNull final ServerRequest request) {
        Flux.fromArray(request.queryParam("repos").get().split(","))
                .subscribe(repo ->
                                getProject(repo).subscribe(pr -> System.out.println(pr.getPull_request().getTitle()))
                        );
       // test repo: polis-mail-ru/2017-highload-kv
        // TODO: add saving pull requests to database
        return ok().build();
    }

    @NotNull
    public Mono<ServerResponse> getWebHookInformation(@NotNull final ServerRequest request) {
        // TODO: think about filtering pr by state (modified, added, merged)
        request.bodyToFlux(WebHookModel.class).subscribe(pr -> {
            getChangedFiles(pr.getPull_request().getUrl(),1).collectList().subscribe(f -> {
                PullRequestModel pull = new PullRequestModel(pr.getPull_request(),f);
                // only for debug
              //  System.out.println(pull.getAll());
            });
        });
    // TODO: add saving to database and starting clone detection
        return ok().build();
    }
}
