import { Project, PullRequest } from 'types'

export const projects: Project[] = [
  {
    id: 1,
    repoUrl: 'https://github.com/polis-mail-ru/2019-highload-dht',
    creatorId: 1,
    repoOwner: 'polis-mail-ru',
    repoName: '2019-highload-dht',
    repoDescription: 'Курсовой проект 2019 года курса "Highload системы"',
    repoOwnerAvatar: 'https://avatars2.githubusercontent.com/u/31819365?s=200&v=4',
    repoOpenPullCount: 10
  },
  {
    id: 2,
    repoUrl: 'https://github.com/ACCULA/accula',
    creatorId: 1,
    repoOwner: 'ACCULA',
    repoName: 'accula',
    repoDescription: 'Advanced Code Clones UniversaL Analyzer',
    repoOwnerAvatar: 'https://avatars0.githubusercontent.com/u/61988411?s=200&v=4',
    repoOpenPullCount: 0
  },
  {
    id: 3,
    repoUrl: 'https://github.com/polis-mail-ru/2020-db-lsm',
    creatorId: 1,
    repoOwner: 'polis-mail-ru',
    repoName: '2020-db-lsm',
    repoDescription: 'NoSQL course project',
    repoOwnerAvatar: 'https://avatars2.githubusercontent.com/u/31819365?s=200&v=4',
    repoOpenPullCount: 19
  }
]

export const pulls: PullRequest[] = [
  {
    id: 3,
    projectId: 1,
    title: 'Stage 1',
    pullUrl: 'https://github.com/polis-mail-ru/2019-highload-dht/pull/3',
    base: {
      url: 'https://github.com/polis-mail-ru/2019-highload-dht',
      label: 'polis-mail-ru:master',
      sha: 'd6357dccc16c7d5c001fd2a2203298c36fe96b63'
    },
    fork: {
      url: 'https://github.com/kilinochi/2019-highload-dht',
      label: 'kilinochi:master',
      sha: 'a1c28a1b500701819cf9919246f15f3f900bb609'
    },
    author: {
      url: 'https://github.com/kilinochi',
      login: 'kilinochi',
      name: 'Arman Shamenov',
      avatar: 'https://avatars2.githubusercontent.com/u/34065879?v=4'
    },
    open: false,
    createdAt: '2019-09-30T06:09:57Z',
    updatedAt: '2019-10-06T09:00:40Z'
  },
  {
    id: 5,
    projectId: 1,
    title: 'Single Node | Vadim Dyachkov',
    pullUrl: 'https://github.com/polis-mail-ru/2019-highload-dht/pull/5',
    base: {
      url: 'https://github.com/polis-mail-ru/2019-highload-dht',
      label: 'polis-mail-ru:master',
      sha: 'd6357dccc16c7d5c001fd2a2203298c36fe96b63'
    },
    fork: {
      url: 'https://github.com/vaddya/2019-highload-dht',
      label: 'vaddya:master',
      sha: '00b4287b3028bbdc7c913c3bf498c8bc572fadd3'
    },
    author: {
      url: 'https://github.com/vaddya',
      login: 'vaddya',
      name: 'Vadim Dyachkov',
      avatar: 'https://avatars3.githubusercontent.com/u/15687094?v=4'
    },
    open: true,
    createdAt: '2020-05-06T13:02:18Z',
    updatedAt: '2020-05-11T04:02:18Z'
  }
]

const oldCode = `
package org.accula.api.db;

import org.accula.api.db.dto.RefreshToken;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

/**
 * @author Anton Lamtev
 */
@Repository
public interface RefreshTokenRepository extends ReactiveCrudRepository<RefreshToken, Long> {
    //@formatter:off
    @Modifying
    @Query("UPDATE refresh_token " +
           "SET token = :newToken, expiration_date = :newExpirationDate " +
           "WHERE user_id = :userId AND token = :oldToken")
    Mono<Void> replaceRefreshToken(final Long userId,
                                   final String oldToken,
                                   final String newToken,
                                   final Instant newExpirationDate);
    //@formatter:on
}
`

const newCode = `
package org.accula.api.db;

import org.accula.api.db.dto.RefreshToken;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.time.Instant;

/**
 * @author Anton Lamtev
 * @author Vadim Dyachkov
 */
@Repository
public interface RefreshTokenRepository extends ReactiveCrudRepository<RefreshToken, Long> {
    @Modifying
    @Query("UPDATE refresh_token " +
           "SET token = :newToken, expiration_date = :newExpirationDate " +
           "WHERE token = :oldToken AND user_id = :userId")
    Mono<Void> replaceRefreshToken(final Long userId,
                                   final String oldToken,
                                   final String newToken,
                                   final Instant newExpirationDate);
}
`

export const files = { oldCode, newCode }
