const jwt = require("jsonwebtoken");
const  createError =( "http-errors");
const PUBLIC_KEY = process.env.PUBLIC_KEY;
export default async ( req, res, next ) => {
	const bearerHeader = req.headers[ "authorization" ];
	const token = bearerHeader && bearerHeader.split( " " )[ 1 ];
	if ( token == null ) return res.sendStatus( 401 );
	try {
		const decodeToken = jwt.verify( token,PUBLIC_KEY, {
			algorithms: [ "RS256" ],
		} );
		req.user = decodeToken.email;
	} catch ( e ) {
		console.log( { e } );
		return next( new createError.Unauthorized() );
	}

	/*
	decodeToken:
	{
    exp: 1679930616,
    iat: 1679930316,
    auth_time: 1679927048,
    jti: '2e802e51-86ff-4edf-b413-4e0ca2a00d13',
    iss: 'http://127.0.0.1:4000/realms/myrealm',
    aud: 'account',
    sub: 'eb1b5d38-60fe-497f-b15f-9d4d92107560',
    typ: 'Bearer',
    azp: 'myclient',
    nonce: 'e6d91ccb-558c-44a1-8467-36eb21c82b70',
    session_state: '346a399d-3e0f-4a86-95ae-7e63ac3f17bd',
    acr: '0',
    'allowed-origins': [ 'http://localhost:5173' ],
    realm_access: { roles: [Array] },
    resource_access: { account: [Object] },
    scope: 'openid email profile',
    sid: '346a399d-3e0f-4a86-95ae-7e63ac3f17bd',
    email_verified: false,
    name: 'Rimon Fedyuk',
    preferred_username: 'rimonf@elementor.com',
    given_name: 'Rimon',
    family_name: 'Fedyuk',
    email: 'rimonf@elementor.com'
  }
	*/

	next();
};