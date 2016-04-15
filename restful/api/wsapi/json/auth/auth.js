exports.check = function (token,action,privilege) {
	if ( token.type == "super" ) {
		return true ; 
	}
	if( action == ( action & privilege ) ) {
		return true ;
	} 
	else {
		return false ;
	}
}