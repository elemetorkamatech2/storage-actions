const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const getRolesForUser = require('./keycloak-utils.js');
const getKeycloakAdminClient = require('./keycloak-utils.js');
module.exports= async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  const token = bearerHeader && bearerHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  try {
    const decodedToken = jwt.verify(token, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    
    const keycloakAdminClient = getKeycloakAdminClient(); // initialize Keycloak Admin client
      
    const email = decodedToken.email;    
    const userRoles = await getRolesForUser(email);   // get the roles assigned to the user
    const clientId = 'master-realm'; // replace with the relevant client ID
    const clientRole = await keycloakAdminClient.roles.findOneByName({ name: 'read', realm: 'your_realm_name', clientId: clientId });
    const resourceRoles = await keycloakAdminClient.users.listResourcesWithScope({
      id: decodedToken.sub,
      scope: clientId + ':' + clientRole.name
    });   // get the resource roles assigned to the user
    
    const hasReadPermission = userRoles.includes('read') && resourceRoles.map(r => r.name).includes('read');  // check if the user has both "read" roles
    const hasWritePermission = userRoles.includes('write') && resourceRoles.map(r => r.name).includes('write');  // check if the user has both "write" roles
    
    if (!hasReadPermission || !hasWritePermission) {
      return next(new createError.Forbidden());  // If user does not have the required roles, send Forbidden error
    } else {
      req.user = email;  // If user has the required roles, set the user email as req.user
    }
  } catch (e) {
    console.log({ e });
    return next(new createError.Unauthorized());
  }

  next();
};