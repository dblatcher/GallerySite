var config = {};

config.siteSettings = {
	siteName:"My Picture Site",
	defaultGalleryBackgroundColor:"white",
	defaultGalleryForegroundColor:"black",
	imageFileTypes : ['jpg','tif','gif','png','bmp'],
	avatarPicPath : 'images/postAvatars',
	avatarPicMaxSize : 500000,
	avatarPics:[]
};

//set title to 'null' if the page should not appear in the navBar
config.pages = [
	{path:'/', viewName:'standard',content:'home', title:'Home',styleSheets:["newsPost.css","style-home.css"]},
	{path:'/gallery', viewName:'standard', title:'Galleries',content:'galleriesList', styleSheets:["style-galleries.css"]},
	{path:'/about', viewName:'standard', title:'About', content:'about',styleSheets:["backgroundImage.css"]},
	{path:'/news', viewName:'standard', title:'News',content:'newsList', styleSheets:["newsPost.css"]},
	{path:'/login', viewName:'standard', content:'login', title:'log in'},
	{path:'/admin', viewName:'standard', content:'admin',title:'admin', scripts:["adminScript.js"],styleSheets:["style-admin.css", "Modals.css"], requiresLogin:true},
	{path:'/postAdmin', viewName:'standard', content:'postAdmin', title:'posts', scripts:["usePostControlTemplates.js","postAdmin.js"],styleSheets:["postAdmin.css","Modals.css"], requiresLogin:true},
];


config.errorPageViewName = 'standard';
config.get404ErrorMessage = function(request) {
	return "404. '" + request.path + "' not found!";
}


// THIS SHOULD ONLY BE SET TO FALSE FOR DEVELOPMENT
// IT DISABLES THE AUTHENTICATION MIDDLEWARE
config.authenticationEnabled = false;



module.exports = config;