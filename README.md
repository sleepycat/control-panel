# Control Panel

This is a small project to explore some new technologies.
The data here is the Canadian Centre for Cybersecurity's [ITSG-33 control catalog](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).
Since the controls are all interconnected the idea is to use it to explore the graph capabilities of [SurrealDB](https://surrealdb.com/features#surrealql).

## Getting started

```sh
# Run the database with
docker run --rm --network host -d -v /mydata:/mydata surrealdb/surrealdb:latest start --log trace --user root --pass root file:/data/itsg.db
# or 
docker-compose up -d
# import the data with a locally installed version wtih the surreal cli:
surreal import -c http://localhost:8000 -u root -p root --ns itsg --db controls database/itsg.sql
# Query the db directly:
curl -s --header "NS: itsg" --header "DB: controls" --header "Accept: application/json" --user "root:root" --data "SELECT count() FROM controls GROUP ALL;" http://localhost:8000/sql | jq .
# Explore the API
firefox localhost:3000/graphql
```
