window.App={Models:{},Collections:{},Views:{},Routers:{},init:function(){"use strict";console.log("Hello from Backbone!"),this.Players=new this.Collections.PlayerCollection,new this.Views.AppView}},$(document).ready(function(){"use strict";App.init()}),this.JST=this.JST||{},this.JST["app/scripts/templates/app-view.ejs"]=function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+="";return __p},this.JST["app/scripts/templates/player-view.ejs"]=function(obj){obj||(obj={});{var __t,__p="";_.escape}with(obj)__p+='<div class="col-xs-6" id="player">\r\n  <h4 id="username">'+(null==(__t=name)?"":__t)+'</h4>\r\n</div>\r\n<div class="col-xs-6" id="player-status">\r\n  <div class="pull-right">\r\n    <button type="button" data-toggle="button" class="btn btn-default btn-circle btn-lg '+(null==(__t=playing?"active":"")?"":__t)+'">\r\n      <i class="fa fa-thumbs-o-up fa-lg"></i>\r\n    </button>\r\n  </div>\r\n</div>\r\n<div class="clearfix"></div>';return __p},App.Models=App.Models||{},function(){"use strict";App.Models.PlayerModel=Backbone.Model.extend({idAttribute:"_id",initialize:function(){},defaults:{email:"",name:"",playing:!1},validate:function(){},parse:function(a){return a},toggle:function(){console.log(this.isNew()),this.save({playing:!this.get("playing")})}})}(),App.Collections=App.Collections||{},function(){"use strict";App.Collections.PlayerCollection=Backbone.Collection.extend({url:"http://localhost:3000/api/users",model:App.Models.PlayerModel}),App.Collections.PlayerCollectionLocalStorage=Backbone.Collection.extend({localStorage:new Backbone.LocalStorage("players"),model:App.Models.PlayerModel})}(),App.Views=App.Views||{},function(){"use strict";App.Views.PlayerView=Backbone.View.extend({template:JST["app/scripts/templates/player-view.ejs"],tagName:"div",id:"",className:"list-group-item",events:{"click #player-status button":"togglePlaying"},initialize:function(){this.listenTo(this.model,"change",this.render),this.$el.toggleClass("playing",this.model.get("playing"))},render:function(){return this.$el.html(this.template(this.model.toJSON())),this.$el.toggleClass("playing",this.model.get("playing")),this},togglePlaying:function(){this.model.toggle()}})}(),App.Views=App.Views||{},function(){"use strict";App.Views.AppView=Backbone.View.extend({el:"#app-view",template:JST["app/scripts/templates/app-view.ejs"],tagName:"div",id:"",className:"",events:{},initialize:function(){this.addAllPlayers(),this.listenTo(App.Players,"add",this.addPlayer),this.listenTo(App.Players,"reset",this.addAllPlayers)},addPlayer:function(a){var b=new App.Views.PlayerView({model:a});$("#player-list").append(b.render().el)},addAllPlayers:function(){$("#player-list").html(""),App.Players.fetch(),App.Players.each(this.addPlayer,this)}})}();