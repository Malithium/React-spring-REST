# React-spring-REST
This repository is my submission for assignment 2 of the CI346 module, the implementation of this project heavily borrows from the 
tutorial: https://spring.io/guides/tutorials/react-and-spring-data-rest/ which is under the Creative Commons Licence.

# Database setup
There is an included db.sql in the static resources folder that should build the database required to run this application, you will also need to configure the application
properties, more specifically the:

 - spring.datasource.url=

 - spring.datasource.username=

 - spring.datasource.password=

 - spring.datasource.driver-class-name=

fields to configure the database

# Keycloak setup
the Keycloak implementation was loosely based on this tutorial: http://slackspace.de/articles/authentication-with-spring-boot-angularjs-and-keycloak/
as such the setup used is very similar, you will require a keycloak.json file in the static resources of the project you will also need to
configure the application properties:

 - keycloak.realm =

 - keycloak.realm-key = 

 - keycloak.ssl-required =

 - keycloak.resource = 

 - keycloak.bearer-only =

 - keycloak.credentials.secret = 

 - keycloak.securityConstraints[0].securityCollections[0].name =

 - keycloak.securityConstraints[0].securityCollections[0].authRoles[0] = 

 - keycloak.securityConstraints[0].securityCollections[0].authRoles[1] =

 - keycloak.securityConstraints[0].securityCollections[0].patterns[0] = 

in order for it to work

# Known Bugs and issues
 - There is a delay when creating a shift for an employee, the display for this feature closes itself, and takes some time to reopen when clicked
 - there is no way to update shifts, this functionality was not implemented