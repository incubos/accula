import React from 'react'
import { Badge, Col, Grid, ListGroup, ListGroupItem, Panel, Row } from 'react-bootstrap'
import { format, formatDistanceToNow } from 'date-fns'

import { PullRequest as Pull } from 'types'
import { GitHubLink, Link } from 'components/Link'

const DATE_TITLE_FORMAT = "d MMMM yyyy 'at' HH:mm"

export const PullOverviewTab = (pull: Pull) => {
  const previous = pull.id % 3 === 0 ? [] : [pull, pull]
  return (
    <>
      <Grid fluid style={{ padding: 0 }}>
        <Row>
          <Col xs={12} sm={8} md={8} lg={5}>
            <Panel className="pull-overview">
              <Panel.Heading>
                <Panel.Title>
                  <GitHubLink to={pull.pullUrl} /> {pull.title}
                </Panel.Title>
              </Panel.Heading>
              <ListGroup>
                <ListGroupItem>
                  <i className="fas fa-fw fa-code-branch" /> Pull request into{' '}
                  <Link to={pull.base.url}>
                    <code>{pull.base.label}</code>
                  </Link>{' '}
                  from{' '}
                  <Link to={pull.fork.url}>
                    <code>{pull.fork.label}</code>
                  </Link>
                </ListGroupItem>
                <ListGroupItem>
                  <i className="fas fa-fw fa-eye" /> Pull request status
                  {pull.open ? (
                    <Badge className="badge-success">Open</Badge> //
                  ) : (
                    <Badge className="badge-danger">Closed</Badge>
                  )}
                </ListGroupItem>
                <ListGroupItem>
                  <i className="far fa-fw fa-check-square" /> Checks status
                  <Badge className="badge-success">Passed</Badge>
                </ListGroupItem>
                <ListGroupItem>
                  <i className="far fa-fw fa-copy" /> Clones found
                  <Badge className="badge-warning">1 clone</Badge>
                </ListGroupItem>
                <ListGroupItem>
                  <i className="far fa-fw fa-clock" /> Created
                  <Badge
                    className="badge-info"
                    title={format(new Date(pull.createdAt), DATE_TITLE_FORMAT)}
                  >
                    {formatDistanceToNow(new Date(pull.createdAt), { addSuffix: true })}
                  </Badge>
                </ListGroupItem>
                <ListGroupItem>
                  <i className="far fa-fw fa-clock" /> Last update
                  <Badge
                    className="badge-info" //
                    title={format(new Date(pull.updatedAt), DATE_TITLE_FORMAT)}
                  >
                    {formatDistanceToNow(new Date(pull.updatedAt), { addSuffix: true })}
                  </Badge>
                </ListGroupItem>
              </ListGroup>
            </Panel>
          </Col>

          <Col xs={12} sm={4} md={4} lg={3}>
            <Panel className="panel-user">
              <Panel.Heading>
                <Panel.Title>Student</Panel.Title>
              </Panel.Heading>
              <ListGroup>
                <ListGroupItem className="text-center">
                  <img className="avatar border-gray" src={pull.author.avatar} alt="..." />
                  <h4 className="title">
                    <GitHubLink to={pull.author.url} /> <code>{`@${pull.author.login}`}</code>
                    <br />
                    <small>{pull.author.name}</small>
                  </h4>
                </ListGroupItem>
              </ListGroup>
            </Panel>
          </Col>

          <Col xs={12} sm={12} md={12} lg={4}>
            <Panel className="pull-overview">
              <Panel.Heading>
                <Panel.Title>Previous pull requests</Panel.Title>
              </Panel.Heading>
              <ListGroup>
                {previous.length > 0 ? (
                  previous.map((prevPull, i) => (
                    <ListGroupItem key={prevPull.id + /* TODO: temp */ i}>
                      <Link to={`/projects/${prevPull.projectId}/${prevPull.id}`}>
                        {prevPull.title}
                      </Link>
                      {prevPull.open ? (
                        <Badge className="badge-success">Open</Badge> //
                      ) : (
                        <Badge className="badge-danger">Closed</Badge>
                      )}
                    </ListGroupItem>
                  ))
                ) : (
                  <ListGroupItem>
                    This is the first pull request form <code>@{pull.author.login}</code>
                  </ListGroupItem>
                )}
              </ListGroup>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </>
  )
}
