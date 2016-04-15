var privileges = require('../../../privilege').Privileges;
//RESTFUL API PRIVILEGE
module.exports = {
	//GROUP 
	"CREATE_GROUP" : privileges.GROUP_MANAGE ,
	"MODIFY_GROUP" : privileges.GROUP_MANAGE ,
	"DROP_GROUP" : privileges.GROUP_MANAGE ,
	"LIST_GROUPS" : privileges.GROUP_MANAGE ,
	//USER
	"CREATE_USER" : privileges.USER_MANAGE ,
	"MODIFY_USER" : privileges.USER_MANAGE ,
	"DROP_USER" : privileges.USER_MANAGE ,
	"LIST_USERS" : privileges.USER_MANAGE ,
	//ROLE
	"CREATE_ROLE" : privileges.ROLE_MANAGE ,
	"MODIFY_ROLE" : privileges.ROLE_MANAGE ,
	"DROP_ROLE" : privileges.ROLE_MANAGE ,
	"LIST_ROLES" : privileges.ROLE_MANAGE ,
	//REGION
	"CREATE_REGION" : privileges.REGION_MANAGE ,
	"MODIFY_REGION" :  privileges.REGION_MANAGE ,
	"DROP_REGION" : privileges.REGION_MANAGE ,
	"LIST_REGION" : privileges.REGION_MANAGE ,
	"FIND_USERS_IN_GROUP" :  privileges.GROUP_MANAGE ,
	"ADD_USER" : privileges.GROUP_MANAGE ,
	"DROP_USER_IN_GROUP" : privileges.GROUP_MANAGE,
	//PERMISSION
	"ADD_RESOURCE" : privileges.GROUP_MANAGE,
	"GET_RESOURCE_PERMISSION" : privileges.GROUP_MANAGE,
	"GET_RESOURCE_PERMISSIONS" : privileges.GROUP_MANAGE,
	"DROP_RESOURCE" : privileges.GROUP_MANAGE,
	//BOX
	"BIND_BOX" : privileges.SYSTEM_MANAGE,
	"UNBIND_BOX" : privileges.SYSTEM_MANAGE,
	"GET_BOUND_BOX_BY_ID" : privileges.TICKET_MANAGE,
	"GET_BOUND_BOX_BY_SN" : privileges.TICKET_MANAGE,
	//TICKET
	"ASSIGN_TICKET" : privileges.TICKET_MANAGE,
	"MODIFY_TICKET" : privileges.TICKET_MANAGE,
	"DELETE_TICKET" : privileges.TICKET_MANAGE
}